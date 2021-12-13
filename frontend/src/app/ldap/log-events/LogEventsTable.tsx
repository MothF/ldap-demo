import {DownloadOutlined} from "@ant-design/icons";
import {gql, useLazyQuery} from "@apollo/client";
import {Button, Col, Divider, notification, Result, Row, Spin, Table} from "antd";
import moment from "moment";
import React, {FunctionComponent, useEffect, useMemo, useRef} from 'react';
import {FormattedMessage} from "react-intl";
import {LdapLogEventDto} from "../../../gql/graphql";
import './LogEventsTable.css';

const {Column} = Table;

const LDAP_LOG_EVENT_LIST = gql`
    query LdapLogEventsList {
        ldapLogEventList {
            date
            level
            loggerSimpleName
            message
            thread
            throwableClass
            throwableMessage
        }
    }
`

export const LogEventsTable = () => {
    const [loadLogEvents, {error, loading, data}] = useLazyQuery<[LdapLogEventDto]>(LDAP_LOG_EVENT_LIST, {
        fetchPolicy: 'cache-and-network'
    });

    const loadingRef = useRef(loading);

    useEffect(() => {
        const fetchLogEvents = async (): Promise<void> => {
            if (!loadingRef.current) {
                loadingRef.current = true;
                await loadLogEvents();
                loadingRef.current = false;
            }
        };

        fetchLogEvents().catch(e => {
            console.error(e)
        });
    }, [loadingRef, loadLogEvents])

    const tableData = useMemo(() => mapResponse(data), [data]);

    if (error) return <Result status="error" title={<FormattedMessage id="common.requestFailed"/>}/>;
    return (
        <>
            <Button icon={<DownloadOutlined/>}
                    type="primary"
                    onClick={() => {
                        downloadLogs();
                    }}
                    htmlType="submit"
                    className='export-button'>Download XLS</Button>
            <Row>
                <Table scroll={{x: 'max-content'}}
                       className='log-events-table'
                       dataSource={tableData}
                       expandable={{
                           expandedRowRender: (record: LdapLogEventDto) => <ExceptionDescription logEvent={record}/>,
                           rowExpandable: (record: LdapLogEventDto) => !!record.throwableClass &&
                               !!record.throwableMessage
                       }}
                       loading={loading && {indicator: <Spin/>, size: 'large'}}>
                    <Column title='Level' dataIndex='level' key='level'/>
                    <Column title='Logger' dataIndex='loggerSimpleName' key='loggerSimpleName'/>
                    <Column title='Date' dataIndex='date' key='date'/>
                    <Column title='Thread' dataIndex='thread' key='thread'/>
                    <Column title='message' dataIndex='message' key='message'/>
                </Table>
            </Row>
        </>
    );
}

function mapResponse(data: any): Array<LdapLogEventDto & { key: number }> {
    return data?.ldapLogEventList.map((item: LdapLogEventDto, index: number) => {
        return {
            ...item,
            key: index,
            date: moment(item.date).format('YYYY-MM-DD HH:mm:ss')
        }
    }) ?? [];
}

const ExceptionDescription: FunctionComponent<{ logEvent: LdapLogEventDto }> = ({logEvent}) => {
    return (
        <>
            <Row>
                <Col span={2}>
                    <p>Exception:</p>
                </Col>
                <Col span={14}>
                    <b>{logEvent.throwableClass}</b>
                </Col>
            </Row>
            <Divider className='exception-divider'/>
            <Row>
                <Col span={2}>
                    <p>Message:</p>
                </Col>
                <Col span={14}>
                    <b>{logEvent.throwableMessage}</b>
                </Col>
            </Row>
        </>
    )
}

function downloadLogs() {
    fetch("/rest/ldap/log/xls", {
        method: "GET"
    }).then(response => {
        if (response.ok) {
            return response.blob();
        }
        throw new Error(response.statusText);
    }).then(blob => {
        const anchor: HTMLAnchorElement = document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.download = "LDAP Logs.xls";
        anchor.click();
    }).catch(e => {
        console.error(e)
        notification.error({
            message: 'LDAP logs export',
            description: `Something went wrong while preparing logs XLS to export ${e}`
        })
    });
}
