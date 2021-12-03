import {gql, useLazyQuery} from "@apollo/client";
import {Col, Divider, Form, Input, Row, Spin} from "antd";
import {Result} from "antd/es";
import React, {useEffect, useMemo, useRef} from 'react';
import {FormattedMessage} from "react-intl";
import './SettingsForm.css';


const CONNECTION_SETTINGS = gql`
    query ConnectionSettings {
        connectionSettings {
            baseDn
            ldapImplementation
            masterUserDn
            standardAuthenticationUsers
            urls
        }
    }
`

export const SettingsForm = () => {
    return (
        <>
            <ConnectionSettings/>
        </>
    );
}

const ConnectionSettings = () => {
    const [loadConnectionSettings, {loading, data, error}] = useLazyQuery(CONNECTION_SETTINGS, {
        fetchPolicy: 'cache-first'
    });
    const loadingRef = useRef(loading);

    useEffect(() => {
        const fetchConnectionSettings = async () => {
            if (!loadingRef.current) {
                loadingRef.current = true;
                await loadConnectionSettings();
                loadingRef.current = false;
            }
        }
        fetchConnectionSettings().catch(e => console.error(e));
    }, [loadingRef, loadConnectionSettings]);

    const connectionSettings: ConnectionSettingsType = useMemo((): ConnectionSettingsType => {
        const settings = data?.connectionSettings as ConnectionSettingsType | undefined;
        return settings ?? {} as ConnectionSettingsType;
    }, [data]);

    if (loading) return <Spin size='large'/>;
    if (error) return <Result status="error" title={<FormattedMessage id="common.requestFailed"/>}/>;
    return (
        <>
            <Divider orientation="left">Connection Settings</Divider>
            <Form name='connection-settings'>
                <Row gutter={24}>
                    <Col span={3} className='form-label-col'>
                        Urls:
                    </Col>
                    <Col span={4}>
                        <Form.Item name='baseDn'>
                            <Input disabled={true} defaultValue={connectionSettings.urls}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={3} className='form-label-col'>
                        Base Domain Name:
                    </Col>
                    <Col span={4}>
                        <Form.Item name='baseDn'>
                            <Input disabled={true} defaultValue={connectionSettings.baseDn}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

type ConnectionSettingsType = {
    baseDn: string,
    ldapImplementation: string,
    masterUserDn: string,
    standardAuthenticationUsers: string[],
    urls: string[]
}
