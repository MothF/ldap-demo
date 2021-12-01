import {gql, useLazyQuery} from "@apollo/client";
import {Col, Divider, Result, Row, Spin, Table} from "antd";
import moment from "moment";
import React, {FunctionComponent, useEffect, useMemo} from 'react';
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
    let [loadLogEvents, {error, loading, data}] = useLazyQuery<[LdapLogEventDto]>(LDAP_LOG_EVENT_LIST, {
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        const fetchLogEvents = async (loading: boolean): Promise<void> => {
          if (!loading) {
              await loadLogEvents();
          }
        }
        fetchLogEvents(loading).catch((e) => {
            console.error(e);
        });
    }, [loadLogEvents])
    // <>
    //     <b>{record.throwableClass}</b>
    //     <span/>
    //     <p>{record.throwableMessage}</p>
    // </>/

    const tableData = useMemo(() => mapResponse(data), [data]);

    if (error) return <Result status="error" title={<FormattedMessage id="common.requestFailed"/>}/>;
    return (
        <>
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

const ExceptionDescription: FunctionComponent<{logEvent: LdapLogEventDto}> = ({logEvent}) => {
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
