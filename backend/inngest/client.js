import {Inngest} from "inngest"

// Here, we're just creating a client of inngest, which we can call from anywhere for our tasks.
export const inngest = new Inngest({id: "ticketing-system"})