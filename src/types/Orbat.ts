export type Group = {
    name: string;
    members: Member[];
    subgroups: Group[];
};

export type Member = {
    name: string;
    role: string;
};
