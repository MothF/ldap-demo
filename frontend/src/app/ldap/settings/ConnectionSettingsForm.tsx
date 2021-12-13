import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {Button, Divider, Form, Input, notification, Space, Spin} from "antd";
import {Result} from "antd/es";
import React, {FunctionComponent, useCallback, useEffect, useMemo} from 'react';
import {FormattedMessage} from "react-intl";
import './ConnectionSettingsForm.css';

type ConnectionSettings = {
    baseDn?: string,
    connectionDomainName?: string,
    connectionPassword?: string,
    urls?: string[]
}

const CONNECTION_SETTINGS = gql`
    query ConnectionSettings {
        connectionSettings {
            baseDn
            connectionPassword
            connectionDomainName
            urls
        }
    }
`

const UPDATE_CONNECTION_SETTINGS = gql`
    mutation UpdateConnectionSettings($settings: ConnectionSettingsDtoInput!) {
        updateConnectionSettings(connectionSettings: $settings) {
            baseDn
            connectionPassword
            connectionDomainName
            urls
        }
    }
`

export const ConnectionSettingsForm = () => {
    const [form] = Form.useForm<ConnectionSettings>();

    const [loadSettings, {loading, data, error}] = useLazyQuery(CONNECTION_SETTINGS);
    const [updateConnectionSettings] = useMutation(UPDATE_CONNECTION_SETTINGS)

    const connectionSettings: ConnectionSettings = useMemo(() => data?.connectionSettings ?? {}, [data]);

    const fetchSettings = useCallback(() => {
        if (!loading) {
            loadSettings().catch(e => console.error(e));
        }
    }, [loadSettings])

    const handleFormSubmit = useCallback(async (formData: any) => {
        let updateErrors: string | undefined;
        try {
            const {errors} = await updateConnectionSettings({
                variables: {
                    settings: convertFormData(formData)
                }
            });
            updateErrors = errors ? `${errors}` : undefined;
        } catch (e) {
            updateErrors = updateErrors ? updateErrors + `\n${e}` : `${e}`;
        }
        if (!updateErrors) {
            notification.success({
                message: 'Connection settings update',
                duration: 1,
                description: 'Connection settings were successfully updated'
            })
        } else {
            notification.error({
                message: 'Connection settings update',
                description: `Something went wrong while updating connection settings,\n${updateErrors}`
            })
        }
    }, [updateConnectionSettings, convertFormData]);

    useEffect(() => fetchSettings(), [fetchSettings]);

    if (loading) return <Spin size='large'/>;
    if (error) return <Result status="error" title={<FormattedMessage id="common.requestFailed"/>}/>;
    return (
        <>
            <Divider orientation="left">Connection Settings</Divider>
            <Form name='connection-settings'
                  labelCol={{span: 3}}
                  wrapperCol={{span: 6}}
                  form={form}
                  layout={'horizontal'}
                  initialValues={connectionSettings}
                  onFinish={handleFormSubmit}>
                <SettingsFormInput label='Urls' name='urls'/>
                <SettingsFormInput label='Base Domain Name' name='baseDn'/>
                <SettingsFormInput label='Username' name='connectionDomainName'/>
                <SettingsFormInput label='Password' name='connectionPassword'/>
                <Form.Item wrapperCol={{offset: 3, span: 20}}>
                    <Button type="primary" htmlType="submit" className='save-button'>Save</Button>
                    <Space/>
                    <Button className='discard-button' onClick={() => form.resetFields()}>Discard</Button>
                </Form.Item>
            </Form>
        </>
    )
}

const SettingsFormInput: FunctionComponent<{ label: string, name: string }> = ({label, name}) => {
    return (
        <>
            <Form.Item label={`${label}:`} labelAlign={'left'} name={name} rules={[
                {
                    required: true,
                    message: `Please specify ${label}`
                }
            ]}>
                <Input className='settings-form-input'/>
            </Form.Item>
        </>
    )
}

function convertFormData(formData: any): ConnectionSettings {
    const {urls} = formData;
    const toUpdate: ConnectionSettings = {
        baseDn: formData.baseDn,
        connectionDomainName: formData.connectionDomainName,
        connectionPassword: formData.connectionPassword
    };
    toUpdate.urls = typeof urls === 'string'
        ? urls.split(',').map((url: string) => url.trim())
        : urls;
    return toUpdate;
}
