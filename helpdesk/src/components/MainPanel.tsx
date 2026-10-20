import { useState } from "react";
import type { Status, Ticket } from "../data/tickets";
import { TicketCard } from "./TicketCard";
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap";
import LoginForm from "./LoginForm";

interface MainPanelProps {
  title: string;
  tickets: Ticket[];
}

export function MainPanel({ title, tickets }: MainPanelProps) {
 


  return (
    <div className="p-4">
      <Container>

        <LoginForm />
     
      </Container>
    </div>
  );
}
