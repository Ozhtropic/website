import { getSupabaseAdmin } from "./supabase-admin.js";

export const chatTools = [
  {
    type: "function",
    function: {
      name: "capture_lead",
      description:
        "Capture a qualified lead when the user wants follow-up, a quote, consulting, or contact from Ozthropic.",
      strict: true,
      parameters: {
        type: "object",
        properties: {
          full_name: { type: "string", description: "The user's name." },
          email: { type: "string", description: "The user's email address." },
          phone: { type: "string", description: "The user's phone number." },
          company: { type: "string", description: "The user's company or business name." },
          interest: { type: "string", description: "What the user wants help with." },
          preferred_contact_method: {
            type: "string",
            enum: ["email", "phone", "telegram", "whatsapp", "other"],
            description: "The user's preferred way to be contacted.",
          },
          notes: { type: "string", description: "Any extra lead notes." },
        },
        required: ["full_name", "interest"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_registration_status",
      description:
        "Check the current status of a registration, application, or enrolment by reference code, email, or phone.",
      strict: true,
      parameters: {
        type: "object",
        properties: {
          reference_code: { type: "string", description: "Registration or enrolment reference code." },
          email: { type: "string", description: "Email address used at registration." },
          phone: { type: "string", description: "Phone number used at registration." },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
];

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

async function captureLead(args, context) {
  const supabase = getSupabaseAdmin();
  const fullName = clean(args.full_name);
  const email = clean(args.email);
  const phone = clean(args.phone);
  const interest = clean(args.interest);

  if (!fullName || !interest) {
    return {
      ok: false,
      status: "missing_required_fields",
      message: "A lead needs at least a full name and a stated interest.",
    };
  }

  if (!email && !phone) {
    return {
      ok: false,
      status: "missing_contact_details",
      message: "A lead needs at least one contact detail: email or phone.",
    };
  }

  const payload = {
    session_id: context.sessionId,
    user_key: context.userKey,
    source_channel: context.channel,
    language: context.language,
    full_name: fullName,
    email: email || null,
    phone: phone || null,
    company: clean(args.company) || null,
    interest,
    preferred_contact_method: clean(args.preferred_contact_method) || null,
    notes: clean(args.notes) || null,
    metadata: context.metadata || {},
  };

  const { data, error } = await supabase
    .from("leads")
    .insert(payload)
    .select("id, created_at, full_name, email, phone, company, interest")
    .single();

  if (error) {
    throw error;
  }

  return {
    ok: true,
    status: "captured",
    lead: data,
  };
}

async function checkRegistrationStatus(args) {
  const supabase = getSupabaseAdmin();
  const referenceCode = clean(args.reference_code);
  const email = clean(args.email);
  const phone = clean(args.phone);

  if (!referenceCode && !email && !phone) {
    return {
      ok: false,
      found: false,
      status: "missing_lookup_key",
      message: "Need a reference code, email, or phone number to check a registration.",
    };
  }

  let query = supabase
    .from("registration_statuses")
    .select("reference_code, full_name, status, updated_at, note")
    .limit(3);

  if (referenceCode) {
    query = query.eq("reference_code", referenceCode);
  } else if (email) {
    query = query.ilike("email", email);
  } else if (phone) {
    query = query.eq("phone", phone);
  }

  const { data, error } = await query.order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  if (!data?.length) {
    return {
      ok: true,
      found: false,
      status: "not_found",
      matches: [],
    };
  }

  return {
    ok: true,
    found: true,
    status: "found",
    matches: data,
  };
}

export async function executeToolCall(toolCall, context) {
  const args = toolCall?.function?.arguments ? JSON.parse(toolCall.function.arguments) : {};

  if (toolCall.function.name === "capture_lead") {
    return captureLead(args, context);
  }

  if (toolCall.function.name === "check_registration_status") {
    return checkRegistrationStatus(args, context);
  }

  return {
    ok: false,
    status: "unknown_tool",
    message: `Unknown tool: ${toolCall.function.name}`,
  };
}

