import request, { Response } from "supertest";
import app from "../src/app";

describe("Support Ticket Routes", () => {
    let createdTicketId: number;

    it("should create a ticket successfully", async () => {
        const response: Response = await request(app).post("/api/v1/tickets").send({
            title: "Test ticket",
            description: "Test description",
            priority: "low",
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");

        createdTicketId = response.body.id;
    });

    it("should return 400 when title is missing", async () => {
        const response: Response = await request(app).post("/api/v1/tickets").send({
            description: "No title",
            priority: "low",
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Missing required field: title");
    });

    it("should return all tickets", async () => {
        const response: Response = await request(app).get("/api/v1/tickets");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return 404 for invalid ticket ID", async () => {
        const response: Response = await request(app).get("/api/v1/tickets/99");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Ticket not found");
    });

    it("should return 400 for invalid priority update", async () => {
        const response: Response = await request(app)
            .put(`/api/v1/tickets/${createdTicketId}`)
            .send({
                priority: "urgent",
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Invalid priority. Must be one of: critical, high, medium, low"
        );
    });

    it("should delete a ticket", async () => {
        const response: Response = await request(app)
            .delete(`/api/v1/tickets/${createdTicketId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Ticket deleted successfully");
    });
});
