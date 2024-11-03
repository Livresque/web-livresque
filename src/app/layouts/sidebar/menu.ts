import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        link: '/dashboards/',
    },
    {
        id: 8,
        isLayout: true
    },
    {
        id: 9,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true
    },
    {
        id: 13,
        label: 'MENUITEMS.ECOMMERCE.TEXT',
        icon: 'bx-store',
        subItems: [
            {
                id: 21,
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDPRODUCT',
                link: '/ecommerce/add-product',
                parentId: 13
            },
            {
                id: 14,
                label: 'MENUITEMS.ECOMMERCE.LIST.PRODUCTS',
                link: '/ecommerce/products',
                parentId: 13
            },
            {
                id: 16,
                label: 'MENUITEMS.ECOMMERCE.LIST.ORDERS',
                link: '/ecommerce/orders',
                parentId: 13
            },
            {
                id: 17,
                label: 'MENUITEMS.ECOMMERCE.LIST.CUSTOMERS',
                link: '/ecommerce/customers',
                parentId: 13
            },
            {
                id: 18,
                label: 'MENUITEMS.ECOMMERCE.LIST.SHOP',
                link: '/ecommerce/list-shop',
                parentId: 13
            }
        ]
    },
    {
        id: 30,
        label: 'MENUITEMS.EMAIL.TEXT',
        icon: 'bx-envelope',
        subItems: [
            {
                id: 31,
                label: 'MENUITEMS.EMAIL.LIST.INBOX',
                link: '/email/inbox',
                parentId: 30
            }
        ]
    },
    // {
    //     id: 37,
    //     label: 'MENUITEMS.INVOICES.TEXT',
    //     icon: 'bx-receipt',
    //     subItems: [
    //         {
    //             id: 38,
    //             label: 'MENUITEMS.INVOICES.LIST.INVOICELIST',
    //             link: '/invoices/list',
    //             parentId: 37
    //         }
    //     ]
    // },
    // {
    //     id: 40,
    //     label: 'MENUITEMS.PROJECTS.TEXT',
    //     icon: 'bx-briefcase-alt-2',
    //     subItems: [
    //         {
    //             id: 41,
    //             label: 'MENUITEMS.PROJECTS.LIST.GRID',
    //             link: '/projects/grid',
    //             parentId: 40
    //         },
    //         {
    //             id: 42,
    //             label: 'MENUITEMS.PROJECTS.LIST.PROJECTLIST',
    //             link: '/projects/list',
    //             parentId: 40
    //         }
    //     ]
    // },
    // {
    //     id: 49,
    //     label: 'MENUITEMS.CONTACTS.TEXT',
    //     icon: 'bxs-user-detail',
    //     subItems: [
    //         {
    //             id: 50,
    //             label: 'MENUITEMS.CONTACTS.LIST.USERGRID',
    //             link: '/contacts/grid',
    //             parentId: 49
    //         },
    //         {
    //             id: 51,
    //             label: 'MENUITEMS.CONTACTS.LIST.USERLIST',
    //             link: '/contacts/list',
    //             parentId: 49
    //         }
    //     ]
    // },
    {
        id: 50,
        label: 'MENUITEMS.SETTING.TEXT',
        isTitle: true
    },

    {
        id: 51,
        label: 'MENUITEMS.SETTING.LIST.SUPPORT',
        icon: 'bx-chat',
        link: '/chat',

    },
];

