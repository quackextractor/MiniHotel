// Client-side mock database for Demo Mode

const DEFAULT_ROOMS = [
  { id: 1, room_number: "101", room_type: "Single", description: "Cozy single room with view", capacity: 1, base_rate: 80.0, is_active: true, group_id: null, group: null },
  { id: 2, room_number: "102", room_type: "Double", description: "Spacious double room", capacity: 2, base_rate: 120.0, is_active: true, group_id: null, group: null },
  { id: 3, room_number: "201", room_type: "Suite", description: "Luxury suite with balcony", capacity: 2, base_rate: 250.0, is_active: true, group_id: null, group: null },
  { id: 4, room_number: "202", room_type: "Family", description: "Large room for families", capacity: 4, base_rate: 200.0, is_active: true, group_id: null, group: null }
];

const DEFAULT_GUESTS = [
  { id: 1, first_name: "John", last_name: "Doe", email: "john.doe@example.com", phone: "555-0101", address: "123 Main St, Springfield" },
  { id: 2, first_name: "Jane", last_name: "Smith", email: "jane.smith@example.com", phone: "555-0102", address: "456 Oak Ave, Metropolis" },
  { id: 3, first_name: "Alice", last_name: "Johnson", email: "alice.j@example.com", phone: "555-0103", address: "789 Pine Ln, Gotham" }
];

const DEFAULT_BOOKINGS = [
  {
    id: 1,
    booking_id: "BKG-0001",
    guest_id: 1,
    room_id: 1,
    check_in: "2026-06-01",
    check_out: "2026-06-05",
    number_of_guests: 1,
    total_amount: 320.0,
    status: "confirmed",
    payment_status: "paid",
    notes: "Late check-in requested",
    services: []
  },
  {
    id: 2,
    booking_id: "BKG-0002",
    guest_id: 2,
    room_id: 2,
    check_in: "2026-06-10",
    check_out: "2026-06-12",
    number_of_guests: 2,
    total_amount: 240.0,
    status: "pending",
    payment_status: "pending",
    notes: "Allergic to peanuts",
    services: []
  },
  {
    id: 3,
    booking_id: "BKG-0003",
    guest_id: 3,
    room_id: 3,
    check_in: "2026-07-01",
    check_out: "2026-07-07",
    number_of_guests: 2,
    total_amount: 1500.0,
    status: "checked-in",
    payment_status: "paid",
    notes: "Anniversary trip",
    services: []
  }
];

const DEFAULT_HOUSEKEEPING = [
  { id: 1, room_id: 1, status: "clean", last_cleaned: "2026-06-20", cleaner: "Sarah Connor", notes: "No notes", updated_at: "2026-06-20T10:00:00Z" },
  { id: 2, room_id: 2, status: "clean", last_cleaned: "2026-06-20", cleaner: "Sarah Connor", notes: "", updated_at: "2026-06-20T10:00:00Z" },
  { id: 3, room_id: 3, status: "clean", last_cleaned: "2026-06-20", cleaner: "Sarah Connor", notes: "", updated_at: "2026-06-20T10:00:00Z" },
  { id: 4, room_id: 4, status: "dirty", last_cleaned: null, cleaner: null, notes: "Checkout messy", updated_at: "2026-06-20T11:00:00Z" }
];

const DEFAULT_MAINTENANCE = [
  { id: 1, ticket_id: "MNT-0001", area: "Room 101", issue: "Leaking faucet", reported_date: "2026-06-19", priority: "medium", status: "pending", assigned_to: "Bob Builder", notes: "Parts ordered" }
];

const DEFAULT_CONTACTS = [
  { id: 1, role: "Manager", name: "Sarah Connor", phone: "555-1111", email: "manager@minihotel.com", on_call: true },
  { id: 2, role: "Maintenance", name: "Bob Builder", phone: "555-2222", email: "fixit@minihotel.com", on_call: false }
];

const DEFAULT_SEASONAL_RATES = [
  { id: 1, name: "Summer Peak", start_date: "2026-06-01", end_date: "2026-08-31", rate_multiplier: 1.25, room_type: null },
  { id: 2, name: "Winter Discount", start_date: "2026-01-01", end_date: "2026-02-28", rate_multiplier: 0.85, room_type: "Single" }
];

const DEFAULT_SERVICES = [
  { id: 1, name: "Breakfast", description: "Daily continental breakfast", price: 15.0, is_active: true },
  { id: 2, name: "Airport Shuttle", description: "One-way transfer to airport", price: 30.0, is_active: true },
  { id: 3, name: "Spa Access", description: "Full day access to spa facilities", price: 50.0, is_active: true }
];

const DEFAULT_ROOM_GROUPS: any[] = [];

const DEFAULT_AUDIT_LOGS = [
  { id: 1, user_id: 1, action: "LOGIN", details: "User admin logged in", timestamp: "2026-06-20T09:00:00Z", ip_address: "127.0.0.1", user: { id: 1, username: "admin" } }
];

function getStorage<T>(key: string, initial: T): T {
  if (typeof window === "undefined") return initial;
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(val);
  } catch {
    return initial;
  }
}

function setStorage<T>(key: string, data: T): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export function handleDemoFetch(urlStr: string, init?: RequestInit): Response {
  const url = new URL(urlStr, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  const pathname = url.pathname;
  const method = init?.method || "GET";
  const body = init?.body ? JSON.parse(init.body as string) : null;

  // Retrieve states
  const rooms = getStorage("demo_rooms", DEFAULT_ROOMS);
  const guests = getStorage("demo_guests", DEFAULT_GUESTS);
  const bookings = getStorage("demo_bookings", DEFAULT_BOOKINGS);
  const housekeeping = getStorage("demo_housekeeping", DEFAULT_HOUSEKEEPING);
  const maintenance = getStorage("demo_maintenance", DEFAULT_MAINTENANCE);
  const contacts = getStorage("demo_contacts", DEFAULT_CONTACTS);
  const seasonalRates = getStorage("demo_seasonal_rates", DEFAULT_SEASONAL_RATES);
  const services = getStorage("demo_services", DEFAULT_SERVICES);
  const roomGroups = getStorage("demo_room_groups", DEFAULT_ROOM_GROUPS);
  const auditLogs = getStorage("demo_audit_logs", DEFAULT_AUDIT_LOGS);

  const makeResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  };

  // Auth & Status
  if (pathname === "/api/auth/status") {
    return makeResponse({ initialized: true });
  }
  if (pathname === "/api/auth/login") {
    return makeResponse({ token: "mock.jwt.token", username: body?.username || "admin" });
  }
  if (pathname === "/api/auth/register") {
    return makeResponse({ message: "Registered successfully" });
  }
  if (pathname === "/api/auth/change-password") {
    return makeResponse({ message: "Password changed successfully" });
  }

  // Room Groups
  if (pathname === "/api/room-groups") {
    if (method === "GET") {
      return makeResponse(roomGroups);
    }
    if (method === "POST") {
      const newGroup = { ...body, id: Date.now() };
      roomGroups.push(newGroup);
      setStorage("demo_room_groups", roomGroups);
      return makeResponse(newGroup);
    }
  }
  const roomGroupMatch = pathname.match(/^\/api\/room-groups\/(\d+)$/);
  if (roomGroupMatch) {
    const id = parseInt(roomGroupMatch[1]);
    const index = roomGroups.findIndex(rg => rg.id === id);
    if (method === "PUT") {
      if (index !== -1) {
        roomGroups[index] = { ...roomGroups[index], ...body };
        setStorage("demo_room_groups", roomGroups);
        return makeResponse(roomGroups[index]);
      }
    }
    if (method === "DELETE") {
      if (index !== -1) {
        roomGroups.splice(index, 1);
        setStorage("demo_room_groups", roomGroups);
      }
      return makeResponse({ message: "Deleted" });
    }
  }

  // Rooms
  if (pathname === "/api/rooms") {
    if (method === "GET") {
      return makeResponse(rooms);
    }
    if (method === "POST") {
      const newRoom = { ...body, id: Date.now(), is_active: body.is_active ?? true };
      rooms.push(newRoom);
      setStorage("demo_rooms", rooms);
      return makeResponse(newRoom);
    }
  }
  const roomMatch = pathname.match(/^\/api\/rooms\/(\d+)$/);
  if (roomMatch) {
    const id = parseInt(roomMatch[1]);
    const index = rooms.findIndex(r => r.id === id);
    if (method === "GET") {
      return makeResponse(rooms[index] || null);
    }
    if (method === "PUT") {
      if (index !== -1) {
        rooms[index] = { ...rooms[index], ...body };
        setStorage("demo_rooms", rooms);
        return makeResponse(rooms[index]);
      }
    }
    if (method === "DELETE") {
      if (index !== -1) {
        rooms.splice(index, 1);
        setStorage("demo_rooms", rooms);
      }
      return makeResponse({ message: "Deleted" });
    }
  }

  // Guests
  if (pathname === "/api/guests/search") {
    const query = url.searchParams.get("q") || "";
    const filtered = guests.filter(g =>
      `${g.first_name} ${g.last_name}`.toLowerCase().includes(query.toLowerCase()) ||
      g.email.toLowerCase().includes(query.toLowerCase())
    );
    return makeResponse(filtered);
  }
  if (pathname === "/api/guests") {
    if (method === "GET") {
      return makeResponse(guests);
    }
    if (method === "POST") {
      const newGuest = { ...body, id: Date.now() };
      guests.push(newGuest);
      setStorage("demo_guests", guests);
      return makeResponse(newGuest);
    }
  }
  const guestMatch = pathname.match(/^\/api\/guests\/(\d+)$/);
  if (guestMatch) {
    const id = parseInt(guestMatch[1]);
    const index = guests.findIndex(g => g.id === id);
    if (method === "GET") {
      return makeResponse(guests[index] || null);
    }
    if (method === "PUT") {
      if (index !== -1) {
        guests[index] = { ...guests[index], ...body };
        setStorage("demo_guests", guests);
        return makeResponse(guests[index]);
      }
    }
    if (method === "DELETE") {
      if (index !== -1) {
        guests.splice(index, 1);
        setStorage("demo_guests", guests);
      }
      return makeResponse({ message: "Deleted" });
    }
  }

  // Bookings
  if (pathname === "/api/bookings/calculate-rate") {
    const roomId = body?.room_id;
    const room = rooms.find(r => r.id === roomId);
    if (!room) return makeResponse({ total_amount: 0 });
    const checkIn = new Date(body?.check_in);
    const checkOut = new Date(body?.check_out);
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    let rate = room.base_rate;
    // Simple seasonal rate multiplier
    const matchingRate = seasonalRates.find(sr => {
      const start = new Date(sr.start_date);
      const end = new Date(sr.end_date);
      return checkIn >= start && checkIn <= end;
    });
    if (matchingRate) {
      rate *= matchingRate.rate_multiplier;
    }
    const baseTotal = rate * nights;
    // Add services
    let servicesTotal = 0;
    if (body?.services && Array.isArray(body.services)) {
      body.services.forEach((s: any) => {
        const serv = services.find(srv => srv.id === s.service_id);
        if (serv) {
          servicesTotal += serv.price * (s.quantity || 1);
        }
      });
    }
    return makeResponse({ total_amount: baseTotal + servicesTotal });
  }

  // Helper to fully populate booking object with guest and room info
  const populateBooking = (b: any) => {
    const guestObj = guests.find(g => g.id === b.guest_id) || null;
    const roomObj = rooms.find(r => r.id === b.room_id) || null;
    return {
      ...b,
      guest: guestObj,
      room: roomObj,
    };
  };

  if (pathname === "/api/bookings") {
    if (method === "GET") {
      const populated = bookings.map(populateBooking);
      // Return paginated shape that api.getBookings expects (though it extracts items)
      return makeResponse({
        items: populated,
        total: populated.length,
        pages: 1,
        current_page: 1
      });
    }
    if (method === "POST") {
      const newBooking = {
        ...body,
        id: Date.now(),
        booking_id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
        status: body.status || "confirmed",
        payment_status: body.payment_status || "pending",
        services: body.services || []
      };
      bookings.push(newBooking);
      setStorage("demo_bookings", bookings);
      return makeResponse(populateBooking(newBooking));
    }
  }
  const bookingMatch = pathname.match(/^\/api\/bookings\/(\d+)$/);
  if (bookingMatch) {
    const id = parseInt(bookingMatch[1]);
    const index = bookings.findIndex(b => b.id === id);
    if (method === "GET") {
      return makeResponse(bookings[index] ? populateBooking(bookings[index]) : null);
    }
    if (method === "PUT") {
      if (index !== -1) {
        bookings[index] = { ...bookings[index], ...body };
        setStorage("demo_bookings", bookings);
        return makeResponse(populateBooking(bookings[index]));
      }
    }
    if (method === "DELETE") {
      if (index !== -1) {
        bookings.splice(index, 1);
        setStorage("demo_bookings", bookings);
      }
      return makeResponse({ message: "Deleted" });
    }
  }
  const bookingStatusMatch = pathname.match(/^\/api\/bookings\/(\d+)\/status$/);
  if (bookingStatusMatch) {
    const id = parseInt(bookingStatusMatch[1]);
    const index = bookings.findIndex(b => b.id === id);
    if (method === "PATCH") {
      if (index !== -1) {
        bookings[index] = { ...bookings[index], ...body };
        setStorage("demo_bookings", bookings);
        return makeResponse(populateBooking(bookings[index]));
      }
    }
  }

  // Housekeeping
  if (pathname === "/api/housekeeping") {
    if (method === "GET") {
      return makeResponse(housekeeping);
    }
    if (method === "POST") {
      const newRecord = { ...body, id: Date.now(), updated_at: new Date().toISOString() };
      housekeeping.push(newRecord);
      setStorage("demo_housekeeping", housekeeping);
      return makeResponse(newRecord);
    }
  }
  const housekeepingMatch = pathname.match(/^\/api\/housekeeping\/(\d+)$/);
  if (housekeepingMatch) {
    const id = parseInt(housekeepingMatch[1]);
    const index = housekeeping.findIndex(h => h.id === id);
    if (method === "PUT") {
      if (index !== -1) {
        housekeeping[index] = { ...housekeeping[index], ...body, updated_at: new Date().toISOString() };
        setStorage("demo_housekeeping", housekeeping);
        return makeResponse(housekeeping[index]);
      }
    }
  }

  // Maintenance
  if (pathname === "/api/maintenance") {
    if (method === "GET") {
      return makeResponse(maintenance);
    }
    if (method === "POST") {
      const newTicket = {
        ...body,
        id: Date.now(),
        ticket_id: `MNT-${Math.floor(1000 + Math.random() * 9000)}`,
        reported_date: new Date().toISOString().split("T")[0]
      };
      maintenance.push(newTicket);
      setStorage("demo_maintenance", maintenance);
      return makeResponse(newTicket);
    }
  }
  const maintenanceMatch = pathname.match(/^\/api\/maintenance\/(\d+)$/);
  if (maintenanceMatch) {
    const id = parseInt(maintenanceMatch[1]);
    const index = maintenance.findIndex(m => m.id === id);
    if (method === "PUT") {
      if (index !== -1) {
        maintenance[index] = { ...maintenance[index], ...body };
        setStorage("demo_maintenance", maintenance);
        return makeResponse(maintenance[index]);
      }
    }
  }

  // Contacts
  if (pathname === "/api/contacts") {
    if (method === "GET") {
      return makeResponse(contacts);
    }
    if (method === "POST") {
      const newContact = { ...body, id: Date.now() };
      contacts.push(newContact);
      setStorage("demo_contacts", contacts);
      return makeResponse(newContact);
    }
  }

  // Seasonal Rates
  if (pathname === "/api/seasonal-rates") {
    if (method === "GET") {
      return makeResponse(seasonalRates);
    }
    if (method === "POST") {
      const newRate = { ...body, id: Date.now() };
      seasonalRates.push(newRate);
      setStorage("demo_seasonal_rates", seasonalRates);
      return makeResponse(newRate);
    }
  }
  const seasonalMatch = pathname.match(/^\/api\/seasonal-rates\/(\d+)$/);
  if (seasonalMatch) {
    const id = parseInt(seasonalMatch[1]);
    const index = seasonalRates.findIndex(sr => sr.id === id);
    if (method === "PUT") {
      if (index !== -1) {
        seasonalRates[index] = { ...seasonalRates[index], ...body };
        setStorage("demo_seasonal_rates", seasonalRates);
        return makeResponse(seasonalRates[index]);
      }
    }
    if (method === "DELETE") {
      if (index !== -1) {
        seasonalRates.splice(index, 1);
        setStorage("demo_seasonal_rates", seasonalRates);
      }
      return makeResponse({ message: "Deleted" });
    }
  }

  // Services
  if (pathname === "/api/services") {
    if (method === "GET") {
      return makeResponse(services);
    }
    if (method === "POST") {
      const newService = { ...body, id: Date.now(), is_active: body.is_active ?? true };
      services.push(newService);
      setStorage("demo_services", services);
      return makeResponse(newService);
    }
  }
  const serviceMatch = pathname.match(/^\/api\/services\/(\d+)$/);
  if (serviceMatch) {
    const id = parseInt(serviceMatch[1]);
    const index = services.findIndex(s => s.id === id);
    if (method === "PUT") {
      if (index !== -1) {
        services[index] = { ...services[index], ...body };
        setStorage("demo_services", services);
        return makeResponse(services[index]);
      }
    }
    if (method === "DELETE") {
      if (index !== -1) {
        services.splice(index, 1);
        setStorage("demo_services", services);
      }
      return makeResponse({ message: "Deleted" });
    }
  }

  // Exchange Rates
  if (pathname === "/api/exchange-rates") {
    return makeResponse({
      rates: {
        CZK: 1,
        EUR: 0.041,
        USD: 0.044,
        GBP: 0.035,
      },
      last_updated: new Date().toISOString()
    });
  }

  // Statistics
  if (pathname === "/api/statistics/occupancy") {
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const uniqueGuests = new Set(bookings.map(b => b.guest_id)).size;
    const avgOccupancy = totalBookings > 0 ? 68.5 : 0.0;

    const dailyOccupancy = [
      { date: "2026-06-19", occupancy_rate: 60.0 },
      { date: "2026-06-20", occupancy_rate: 70.0 },
      { date: "2026-06-21", occupancy_rate: 75.0 }
    ];

    const roomTypePerformance = [
      { room_type: "Single", booking_count: bookings.filter(b => {
        const room = rooms.find(r => r.id === b.room_id);
        return room?.room_type === "Single";
      }).length },
      { room_type: "Double", booking_count: bookings.filter(b => {
        const room = rooms.find(r => r.id === b.room_id);
        return room?.room_type === "Double";
      }).length },
      { room_type: "Suite", booking_count: bookings.filter(b => {
        const room = rooms.find(r => r.id === b.room_id);
        return room?.room_type === "Suite";
      }).length },
      { room_type: "Family", booking_count: bookings.filter(b => {
        const room = rooms.find(r => r.id === b.room_id);
        return room?.room_type === "Family";
      }).length }
    ];

    return makeResponse({
      average_occupancy_rate: avgOccupancy,
      total_bookings: totalBookings,
      total_revenue: totalRevenue,
      unique_guests: uniqueGuests,
      daily_occupancy: dailyOccupancy,
      room_type_performance: roomTypePerformance
    });
  }

  if (pathname === "/api/statistics/yearly-summary") {
    return makeResponse({
      summary: [
        { month: "Jan", revenue: 1200, occupancy_rate: 45 },
        { month: "Feb", revenue: 1500, occupancy_rate: 50 },
        { month: "Mar", revenue: 1800, occupancy_rate: 55 },
        { month: "Apr", revenue: 2200, occupancy_rate: 60 },
        { month: "May", revenue: 2800, occupancy_rate: 70 },
        { month: "Jun", revenue: 3500, occupancy_rate: 80 }
      ]
    });
  }

  // Audit Logs
  if (pathname === "/api/audit-logs") {
    return makeResponse(auditLogs);
  }

  // Default fallback
  return makeResponse({ error: "Endpoint not matched in demo mode" }, 404);
}
