import { Request, Response } from "express";
import { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket, calculateTicketUrgency, TicketPriority, TicketStatus } from "../services/ticketService";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const createTicketHandler = (req: Request, res: Response): void => {
  const { title, description, priority } = req.body;

  if (!title) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      message: "Missing required field: title" 
    });
    return;
  }

  if (!description) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      message: "Missing required field: description" 
    });
    return;
  }

  if (!priority) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      message: "Missing required field: priority" 
    });
    return;
  }

  const validPriorities: TicketPriority[] = ["critical", "high", "medium", "low"];
  if (!validPriorities.includes(priority as TicketPriority)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      message: "Invalid priority. Must be one of: critical, high, medium, low" 
    });
    return;
  }

  const ticket: ReturnType<typeof createTicket> = createTicket(title, description, priority as TicketPriority);

  res.status(HTTP_STATUS.CREATED).json(ticket);
};

export const getAllTicketsHandler = (_req: Request, res: Response): void => {
  const tickets: ReturnType<typeof getAllTickets> = getAllTickets();
  res.status(HTTP_STATUS.OK).json({
    message: "Tickets retrieved",
    count: tickets.length,
    data: tickets
  });
};

export const getTicketByIdHandler = (req: Request, res: Response): void => {
  const id: number = Number(req.params.id);

  const ticket: ReturnType<typeof getTicketById> = getTicketById(id);

  if (!ticket) {
    res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
    return;
  }

  res.status(HTTP_STATUS.OK).json(ticket);
};

export const updateTicketHandler = (req: Request, res: Response): void => {
  const id: number = Number(req.params.id);
  const { title, description, priority, status } = req.body;

  
  if (priority) {
    const validPriorities: TicketPriority[] = ["critical", "high", "medium", "low"];
    if (!validPriorities.includes(priority as TicketPriority)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: "Invalid priority. Must be one of: critical, high, medium, low" 
      });
      return;
    }
  }

  
  if (status) {
    const validStatuses: TicketStatus[] = ["open", "in-progress", "resolved"];
    if (!validStatuses.includes(status as TicketStatus)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: "Invalid status. Must be one of: open, in-progress, resolved" 
      });
      return;
    }
  }

  const updatedTicket: ReturnType<typeof updateTicket> = updateTicket(id, {
    title,
    description,
    priority: priority as TicketPriority,
    status: status as TicketStatus,
  });

  if (!updatedTicket) {
    res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
    return;
  }

  res.status(HTTP_STATUS.OK).json(updatedTicket);
};

export const deleteTicketHandler = (req: Request, res: Response): void => {
  const id: number = Number(req.params.id);

  const deleted: ReturnType<typeof deleteTicket> = deleteTicket(id);

  if (!deleted) {
    res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
    return;
  }

  res.status(HTTP_STATUS.OK).json({ message: "Ticket deleted successfully" });
};

export const getTicketUrgencyHandler = (req: Request, res: Response): void => {
  const id: number = Number(req.params.id);

  const ticketWithUrgency: ReturnType<typeof calculateTicketUrgency> = calculateTicketUrgency(id);

  if (!ticketWithUrgency) {
    res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
    return;
  }

  res.status(HTTP_STATUS.OK).json({
    message: "Ticket urgency calculated",
    data: ticketWithUrgency,
  });
};