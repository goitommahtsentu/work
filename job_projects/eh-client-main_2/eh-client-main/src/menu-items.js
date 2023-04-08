import BadgeDisplayNavBar from "./components/AgGrid/BadgeDisplayNavbar";
import CreateContact from "./pages/contact/CreateContact";
const menuItems = {
    items: [
        {
            id: 'navigation',
            title: 'Navigation',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'trust',
                    title: 'Trust',
                    type: 'collapse',
                    icon: 'feather icon-clipboard',
                    url: '/trust/list',
                    children: [
                        {
                            id: 'trust',
                            title: 'Trust List',
                            type: 'item',
                            url: '/trust/list',
                        },
                        {
                            id: 'trust-map',
                            title: 'Trust Map',
                            type: 'item',
                            url: '/trust/map',
                        },
                        {
                            id: 'trust-kanban',
                            title: 'Trust Kanban',
                            type: 'item',
                            url: '/trust/kanban',
                        },
                        {
                            id: 'trust-rtp',
                            title: 'Trust RTP',
                            type: 'item',
                            url: '/rtp',
                        },
                        // {
                        //     id: 'trust-todos',
                        //     title: 'My Tasks',
                        //     type: 'item',
                        //     url: '/mytasks',
                        // },
                        {
                            id: 'trust-create',
                            title: 'Create New Trust',
                            type: 'item',
                            url: '/trust',
                        },

                    ]
                },
                {
                    id: 'trust-situations',
                    title: 'Situations',
                    icon: 'feather icon-check-square',
                    // component:()=><BadgeDisplayNavBar />,
                    type: 'item',
                    url: '/situations',
                },
                {
                    id: 'address',
                    title: 'Address',
                    type: 'collapse',
                    icon: 'feather icon-map-pin',
                    url: '/address',
                    children: [
                        {
                            id: 'address',
                            title: 'Address',
                            type: 'item',
                            url: '/address',
                        },
                    ]
                },
                {
                    id: 'contact',
                    title: 'Contact',
                    type: 'collapse',
                    icon: 'feather icon-users',
                    url: '/contact/list',
                    children: [
                        {
                            id: 'contact',
                            title: 'Contact List',
                            type: 'item',
                            url: '/contact/list',
                        },

                        {
                            id: 'contact-kanban',
                            title: 'Contact Kanban',
                            type: 'item',
                            url: '/contact/kanban',
                        },
                        {
                            id: 'contact-create',
                            title: 'Contact Create',
                            type: 'item',
                            component:()=><CreateContact name='Contact' isNavbar/>,
                            url: '/contact/create',
                        }
                    ]
                },
                {
                    id: 'investor',
                    title: 'Investor',
                    type: 'collapse',
                    icon: 'feather icon-users',
                    url: '/investor/list',
                    children: [
                        {
                            id: 'investor',
                            title: 'Investor List',
                            type: 'item',
                            url: '/investor/list',
                        },
                        {
                            id: 'investor-map',
                            title: 'Investor Map',
                            type: 'item',
                            url: '/investor/map',
                        },
                        {
                            id: 'investor-create',
                            title: 'Investor Create',
                            component:()=><CreateContact name='Investor' isNavbar/>,
                            type: 'item',
                            url: '/investor/create',
                        }
                    ]
                },
                {
                    id: 'family',
                    title: 'Family',
                    type: 'collapse',
                    icon: 'feather icon-users',
                    url: '/familylist',
                    children: [
                        {
                            id: 'family',
                            title: 'Family List',
                            type: 'item',
                            url: '/family/list',
                        },
                        {
                            id: 'family-map',
                            title: 'Family Map',
                            type: 'item',
                            url: '/family/map',
                        },
                        {
                            id: 'family-create',
                            title: 'Family Create',
                            component:()=><CreateContact name="Family" isNavbar/>,
                            type: 'item',
                            url: '/family/',
                        }
                    ]
                },
                {
                    id: 'familyLead',
                    title: 'Family Lead',
                    type: 'collapse',
                    icon: 'feather icon-users',
                    url: '/familylead/list',
                    children: [
                        {
                            id: 'familylead',
                            title: 'Family Lead List',
                            type: 'item',
                            url: '/familylead/list',
                        },
                        {
                            id: 'familylead-kanban',
                            title: 'Family Lead Kanban',
                            type: 'item',
                            url: '/familylead/kanban',
                        },
                        {
                            id: 'family Lead-create',
                            title: 'Family Lead Create',
                            component:()=><CreateContact name="Family Lead" isNavbar/>,
                            type: 'item',
                            url: '/investor/create',
                        }
                    ]
                },
               
                {
                    id: 'investorlead',
                    title: 'Investor Lead',
                    type: 'collapse',
                    icon: 'feather icon-users',
                    url: '/investorlead/list',
                    children: [
                        {
                            id: 'investorlead',
                            title: 'Investor Lead List',
                            type: 'item',
                            url: '/investorlead/list',
                        },
                        {
                            id: 'investorlead-kanban',
                            title: 'Investor Lead Kanban',
                            type: 'item',
                            url: '/investorlead/kanban',
                        },
                        {
                            id: 'Investor Lead-create',
                            title: 'Investor Lead Create',
                            component:()=><CreateContact name="Investor Lead" isNavbar/>,
                            type: 'item',
                            url: '/investor/create',
                        }
                    ]
                },
                {
                    id: 'user',
                    title: 'Website',
                    type: 'item',
                    icon: 'feather icon-layout',
                    url: '/user/',
                },
                {
                    id: 'accounting',
                    title: 'Accounting',
                    type: 'item',
                    icon: 'feather icon-layout',
                    url: '/accounting/',
                }
            ]
        },

    ]
};

export default menuItems;
