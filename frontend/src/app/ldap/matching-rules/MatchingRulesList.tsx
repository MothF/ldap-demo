import {Exact} from "@amplicode/gql/graphql";
import {
    EntityListScreenProps,
    guessDisplayName,
    guessLabel,
    OpenInBreadcrumbParams,
    Screens,
    useScreens
} from "@amplicode/react-core";
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {ApolloCache, gql, Reference, useMutation, useQuery} from "@apollo/client";
import {FetchResult} from "@apollo/client/link/core";
import {MutationFunctionOptions} from "@apollo/client/react/types/types";
import {Button, Card, Empty, Modal, Result, Spin} from "antd";
import {observer} from "mobx-react";
import {useCallback, useEffect} from "react";
import {FormattedMessage, IntlShape, useIntl} from "react-intl";
import {useHistory, useRouteMatch} from "react-router-dom";
import MatchingRuleDetails from "./MatchingRuleDetails";

const ROUTE = "ldap-component/matching-rules-list";

const LIST_MATCHING_RULES = gql`
    query listMatchingRules {
        listMatchingRules {
            id
            ldapAttribute
            entityAttribute
            description
        }
    }
`;

const DELETE_MATCHING_RULE = gql`
    mutation deleteMatchingRule($id: Long!) {
        deleteMatchingRule(id: $id)
    }
`;

const MatchingRulesList = observer(({onSelect}: EntityListScreenProps) => {
    const screens: Screens = useScreens();
    const intl = useIntl();
    const match = useRouteMatch<{ entityId: string }>(`/${ROUTE}/:entityId`);
    const history = useHistory();

    const {loading, error, data} = useQuery(LIST_MATCHING_RULES);

    const [executeDeleteMutation] = useMutation(DELETE_MATCHING_RULE);

    // Entity list can work in select mode, which means that you can select an entity instance and it will be passed to onSelect callback.
    // This functionality is used in EntityLookupField.
    const isSelectMode = onSelect != null;

    const openEditor = useCallback(
        (id?: string) => {

            const params: OpenInBreadcrumbParams = {
                breadcrumbCaption: intl.formatMessage({id: 'screen.MatchingRuleDetails'}),
                component: MatchingRuleDetails,
            };
            if (id != null) {
                params.props = {id};
            }
            screens.openInBreadcrumb(params);
            // Append /id to existing url
            history.push(id ? `/${ROUTE}/${id}` : `/${ROUTE}/new`);
        },
        [screens, history, intl]
    );

    useEffect(() => {
        if (
            screens.activeTab?.breadcrumbs.length === 1 &&
            match?.params.entityId != null
        ) {
            openEditor(match.params.entityId);
        }
    }, [match, openEditor, screens]);

    if (loading) {
        return <Spin/>;
    }

    if (error) {
        return (
            <Result
                status="error"
                title={<FormattedMessage id="common.requestFailed"/>}
            />
        );
    }

    const items = data?.["listMatchingRules"];

    if (items == null || items.length === 0) {
        return <Empty/>;
    }

    return (
        <div className="narrow-layout">
            {!isSelectMode && (
                <div style={{marginBottom: "12px"}}>
                    <Button
                        htmlType="button"
                        key="create"
                        title='intl.formatMessage({id: "common.create"})'
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={() => openEditor()}
                    >
            <span>
              <FormattedMessage id="common.create"/>
            </span>
                    </Button>
                </div>
            )}
            {isSelectMode && (
                <div style={{marginBottom: "12px"}}>
                    <Button
                        htmlType="button"
                        key="close"
                        title='intl.formatMessage({id: "common.close"})'
                        type="primary"
                        icon={<CloseOutlined/>}
                        onClick={screens.closeActiveBreadcrumb}
                    >
            <span>
              <FormattedMessage id="common.close"/>
            </span>
                    </Button>
                </div>
            )}

            {items.map((e: any) => (
                <Card
                    key={e["id"]}
                    title={getDisplayedName(e)}
                    style={{marginBottom: "12px"}}
                    actions={getCardActions({
                        screens,
                        entityInstance: e,
                        onSelect,
                        // @ts-ignore
                        executeDeleteMutation,
                        intl,
                        openEditor
                    })}
                >
                    <Fields entity={e}/>
                </Card>
            ))}
        </div>
    );
});

const Fields = ({entity}: { entity: any }) => (
    <>
        {Object.keys(entity)
            .filter(p => p !== "id" && entity[p] != null)
            .map(p => (
                <div key={p}>
                    <strong>{guessLabel(p)}:</strong> {renderFieldValue(entity, p)}
                </div>
            ))}
    </>
);

function renderFieldValue(entity: any, property: string): string {
    return typeof entity[property] === "object"
        ? guessDisplayName(entity[property])
        : String(entity[property]);
}

interface CardActionsInput {
    screens: Screens;
    entityInstance: any;
    onSelect?: (entityInstance: this["entityInstance"]) => void;
    executeDeleteMutation: (
        options?: MutationFunctionOptions<any, Exact<{ id: any }>>
    ) => Promise<FetchResult>;
    intl: IntlShape;
    openEditor: (id?: string) => void;
}

function getCardActions(input: CardActionsInput) {
    const {
        screens,
        entityInstance,
        onSelect,
        executeDeleteMutation,
        intl,
        openEditor
    } = input;

    if (onSelect == null) {
        return [
            <DeleteOutlined
                key="delete"
                title={intl.formatMessage({id: "common.remove"})}
                onClick={() => {
                    Modal.confirm({
                        content: intl.formatMessage({
                            id: "EntityListScreen.deleteConfirmation"
                        }),
                        okText: intl.formatMessage({id: "common.ok"}),
                        cancelText: intl.formatMessage({id: "common.cancel"}),
                        onOk: () => {
                            executeDeleteMutation({
                                variables: {
                                    id: entityInstance.id
                                },
                                update: getUpdateFn(entityInstance)
                            });
                        }
                    });
                }}
            />,
            <EditOutlined
                key="edit"
                title={intl.formatMessage({id: "common.edit"})}
                onClick={() => {
                    openEditor(entityInstance.id);
                }}
            />
        ];
    }

    if (onSelect != null) {
        return [
            <CheckOutlined
                key="select"
                title={intl.formatMessage({
                    id: "EntityLookupField.selectEntityInstance"
                })}
                onClick={() => {
                    if (onSelect != null) {
                        onSelect(entityInstance);
                        screens.closeActiveBreadcrumb();
                    }
                }}
            />
        ];
    }
}

function getUpdateFn(e: any) {
    return (cache: ApolloCache<any>) => {
        cache.modify({
            fields: {
                listMatchingRules(existingRefs, {readField}) {
                    return existingRefs.filter(
                        (ref: Reference) => e["id"] !== readField("id", ref)
                    );
                }
            }
        });
    };
}

function getDisplayedName(matchingRule: any) {
    return !matchingRule.description
        ? `LDAP attribute '${matchingRule.ldapAttribute}' is converted to Entity attribute 
              '${matchingRule.entityAttribute}'`
        : matchingRule.description;
}

export default MatchingRulesList;
