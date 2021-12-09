import {Tabs} from "antd";
import {observer} from "mobx-react";
import './LdapComponent.css';
import {LogEventsTable} from "./log-events/LogEventsTable";
import MatchingRulesList from "./matching-rules/MatchingRulesList";
import {ConnectionSettingsForm} from "./settings/ConnectionSettingsForm";

const {TabPane} = Tabs;

const LDAP_COMPONENT_ROUTE = "ldap-component";

const TabItems = {
    logEvents: {
        key: 'log-events',
        caption: 'Log'
    } as TabInfo,

    matchingRules: {
        key: 'matching-rules',
        caption: 'Matching Rules'
    } as TabInfo,

    settings: {
        key: 'settings',
        caption: 'Settings'
    } as TabInfo
}

const LdapComponent = observer(() => {

    return (
        <div className="wide-layout">
            <Tabs>
                <TabPane tab={TabItems.logEvents.caption} key={TabItems.logEvents.key}>
                    <LogEventsTable/>
                </TabPane>
                <TabPane tab={TabItems.matchingRules.caption} key={TabItems.matchingRules.key}>
                    <MatchingRulesList/>
                </TabPane>
                <TabPane tab={TabItems.settings.caption} key={TabItems.settings.key}>
                    <ConnectionSettingsForm/>
                </TabPane>
            </Tabs>
        </div>
    );
});

type TabInfo = { key: string, caption: string }

export default LdapComponent;
