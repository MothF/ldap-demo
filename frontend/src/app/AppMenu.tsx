import { Menu } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useCallback } from "react";
import { observer } from "mobx-react";
import { screenRegistry } from "./screenRegistry";
import { useLocation } from "react-router-dom";
import { useScreens, getScreenKey } from "@amplicode/react-core";

export const AppMenu = observer(() => {
  const intl = useIntl();
  const screens = useScreens();
  const location = useLocation();

  const handleClick = useCallback(
    ({ key }: { key: string }) => {
      const menuItemInfo = screenRegistry[key];
      if (menuItemInfo == null) {
        // This might be a menu item that doesn't use Screen API
        return;
      }
      const tabCaption = intl.formatMessage({ id: menuItemInfo.captionKey });
      const breadcrumbCaption = intl.formatMessage({
        id: menuItemInfo.captionKey
      });
      const { component } = menuItemInfo;

      screens.openInTab({
        tabCaption,
        breadcrumbCaption,
        component,
        tabKey: key
      });
    },
    [intl, screens]
  );

  const getCaption = useCallback(
    (key: string) => {
      return intl.formatMessage({ id: screenRegistry[key].captionKey });
    },
    [intl]
  );

  const activeItem = getScreenKey(location.pathname);

  return (
    <Menu onClick={handleClick} selectedKeys={activeItem ? [activeItem] : []}>
      <Menu.Item icon={<HomeOutlined />} title={getCaption("home")} key="home">
        {getCaption("home")}
      </Menu.Item>
        <Menu.Item title={getCaption("ldap-component")} key="ldap-component">
            {getCaption("ldap-component")}
        </Menu.Item>
      {/*If you don't need Screen API (tabs / breadcrumbs) you can just use React Router components*/}
      {/*<Menu.Item*/}
      {/*  title='Component1'*/}
      {/*  key='component1'*/}
      {/*>*/}
      {/*  <Link to='/component1'>Component 1</Link>*/}
      {/*</Menu.Item>*/}
    </Menu>
  );
});
