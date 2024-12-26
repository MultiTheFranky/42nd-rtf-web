it("Correct index structure", () => {
    const page = cy.visit("http://localhost:4321");
    page.get("title").should("have.text", "42nd Rangers Task Force");
});
