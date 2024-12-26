export type Group = {
    name: string;
    children: Unit[];
    childrenGroups?: Group[];
}

export type Unit = {
    name: string;
}