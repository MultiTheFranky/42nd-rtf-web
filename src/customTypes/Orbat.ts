import type { Models } from "appwrite";

export type Chart = {
    name: string;
    children: Chart[];
    attributes?: {
        department: string;
    };
};

const orgChart = {
    name: "CEO",
    children: [
        {
            name: "Manager",
            attributes: {
                department: "Production"
            },
            children: [
                {
                    name: "Foreman",
                    attributes: {
                        department: "Fabrication"
                    },
                    children: [
                        {
                            name: "Worker"
                        }
                    ]
                },
                {
                    name: "Foreman",
                    attributes: {
                        department: "Assembly"
                    },
                    children: [
                        {
                            name: "Worker"
                        }
                    ]
                }
            ]
        }
    ]
};

const TeamsOrder = [
    "NCO",
    "SQUAD LEADER",
    "TEAM LEADER",
    "MÉDICO DE COMBATE",
    "RIFLEMAN"
];

export const orderGroupsMembers = (groups: Group[]): Group[] => {
    return groups.map((group) => {
        group.members = group.members.sort((a, b) => {
            return TeamsOrder.indexOf(a.role) - TeamsOrder.indexOf(b.role);
        });
        return group;
    });
};

export const mapGroupsToChart = (groups: Group[]): Chart => {
    return {
        name: "HQ",
        children: groups.map((group) => {
            return {
                name: group.name,
                children: group.members.map((member) => {
                    return {
                        name: member.name
                    };
                })
            } as Chart;
        })
    };
};

export type AppwriteGroup = Group & Models.Document;

export type Group = {
    name: string;
    members: Member[];
    subgroups: Group[];
};

export type AppwriteMember = Member & Models.Document;

export type Member = {
    name: string;
    role: string;
};
