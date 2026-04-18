import { tickets } from "../../../data/tickets";

export type TicketPriority = "critical" | "high" | "medium" | "low";
export type TicketStatus = "open" | "in-progress" | "resolved";

/**
 * Represents a support ticket within the ticket tracking system.
 */
export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
}

/**
 * Represents a support ticket along with its calculated urgency score and level.
 */
export interface TicketUrgency {
  id: number;
  title: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  ticketAge: number;
  urgencyScore: number;
  urgencyLevel: string;
}

/**
 * Creates a new support ticket and adds it to the ticket list.
*/
export const createTicket = (
  title: string,
  description: string,
  priority: TicketPriority
): Ticket => {
  const now: string = new Date().toISOString();

  const newTicket: Ticket = {
    id: tickets.length > 0 ? Math.max(...tickets.map((t) => t.id)) + 1 : 1,
    title,
    description,
    priority,
    status: "open",
    createdAt: now,
  };

  tickets.push(newTicket);
  return newTicket;
};

/**
 * Retrieves all tickets from the ticket list.
*/
export const getAllTickets = (): Ticket[] => {
  return tickets;
};

/**
 * Retrieves a single ticket by its ID.
*/
export const getTicketById = (id: number): Ticket | undefined => {
  return tickets.find((t) => t.id === id);
};


export const updateTicket = (
  id: number,
  updates: {
    title?: string;
    description?: string;
    priority?: TicketPriority;
    status?: TicketStatus;
  }
): Ticket | undefined => {
  const index: number = tickets.findIndex((t) => t.id === id);
  
  if (index === -1) {
    return undefined;
  }

  tickets[index] = {
    ...tickets[index],
    ...updates,
  };

  return tickets[index];
};

export const deleteTicket = (id: number): boolean => {
  const index: number = tickets.findIndex((t) => t.id === id);
  
  if (index === -1) {
    return false;
  }

  tickets.splice(index, 1);
  return true;
};

export const calculateTicketUrgency = (id: number): TicketUrgency | undefined => {
  const ticket: Ticket | undefined = getTicketById(id);
  
  if (!ticket) {
    return undefined;
  }

  const ticketAge: number = Math.floor(
    (Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (ticket.status === "resolved") {
    return {
      id: ticket.id,
      title: ticket.title,
      priority: ticket.priority,
      status: ticket.status,
      createdAt: ticket.createdAt,
      ticketAge,
      urgencyScore: 0,
      urgencyLevel: "Minimal. Ticket resolved.",
    };
  }

  const baseScores: Record<TicketPriority, number> = {
    critical: 50,
    high: 30,
    medium: 20,
    low: 10,
  };

  const urgencyScore: number = baseScores[ticket.priority] + (ticketAge * 5);

  let urgencyLevel: string;
  if (urgencyScore >= 80) {
    urgencyLevel = "Critical. Immediate attention required.";
  } else if (urgencyScore >= 55) {
    urgencyLevel = "High urgency. Prioritize resolution.";
  } else if (urgencyScore >= 30) {
    urgencyLevel = "Moderate. Schedule for attention.";
  } else {
    urgencyLevel = "Low urgency. Address when capacity allows.";
  }

  return {
    id: ticket.id,
    title: ticket.title,
    priority: ticket.priority,
    status: ticket.status,
    createdAt: ticket.createdAt,
    ticketAge,
    urgencyScore,
    urgencyLevel,
  };
};