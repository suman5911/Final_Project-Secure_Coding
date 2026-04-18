import { calculateTicketUrgency, TicketUrgency } from "../src/api/v1/services/ticketService";

describe("Ticket Urgency Calculation", () => {
    it("should calculate low urgency for low priority ticket", () => {
        const result: TicketUrgency | undefined = calculateTicketUrgency(1);

        expect(result).toBeDefined();
        expect(result?.urgencyScore).toBe(25);
        expect(result?.urgencyLevel).toBe(
            "Low urgency. Address when capacity allows."
        );
    });

    it("should calculate critical urgency for critical priority old ticket", () => {
        const result: TicketUrgency | undefined = calculateTicketUrgency(6);

        expect(result).toBeDefined();
        expect(result?.urgencyScore).toBe(80);
        expect(result?.urgencyLevel).toBe(
            "Critical. Immediate attention required."
        );
    });

    it("should return minimal urgency for resolved tickets", () => {
        const result: TicketUrgency | undefined = calculateTicketUrgency(7);

        expect(result).toBeDefined();
        expect(result?.urgencyScore).toBe(0);
        expect(result?.urgencyLevel).toBe("Minimal. Ticket resolved.");
    });

    it("should return undefined for non-existent ticket", () => {
        const result: TicketUrgency | undefined = calculateTicketUrgency(99999);

        expect(result).toBeUndefined();
    });
});
