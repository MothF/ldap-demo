import {Tabs} from "antd";
import {observer} from "mobx-react";
import './LdapComponent.css';
import {LogEventsTable} from "./log-events/LogEventsTable";

const {TabPane} = Tabs;

const ROUTE = "entity-log";

const TabItems = {
    logEvents: {
        key: 'log-events',
        caption: 'LDAP Log'
    } as TabInfo,

    auditPolicy: {
        key: 'audit-policy',
        caption: 'Audit Policy'
    } as TabInfo
}

const LdapComponent = observer(() => {

    return (
        <div className="wide-layout">
            <Tabs>
                <TabPane tab={TabItems.logEvents.caption} key={TabItems.logEvents.key}>
                    <LogEventsTable/>
                </TabPane>
                <TabPane tab={TabItems.auditPolicy.caption} key={TabItems.auditPolicy.key}>
                </TabPane>
            </Tabs>
        </div>
    );
});

type TabInfo = { key: string, caption: string }

export default LdapComponent;
