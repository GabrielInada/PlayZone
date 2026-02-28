// ── Auth ──────────────────────────────────────────────────────────────────────
export const LOGIN_ROUTE = "/login";
export const SIGNUP_ROUTE = "/cadastro";

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const HOME_ROUTE = "/home";
export const ADMIN_ROUTE = "/admin";
export const DELEGADO_ROUTE = "/delegado";
export const CLUBE_ROUTE = "/clube";

// ── Time ──────────────────────────────────────────────────────────────────────
export const CADASTRAR_TIME_ROUTE = "/cadastrar-time";

// ── Campeonatos ───────────────────────────────────────────────────────────────
export const CAMPEONATOS_ROUTE = "/campeonatos";
export const CAMPEONATO_ROUTE = (nome: string) => `/${nome}`;

// ── Súmula & Punições ─────────────────────────────────────────────────────────
export const SUMULA_ROUTE          = "/sumula";
export const VALIDAR_SUMULA_ROUTE  = "/validar-sumula";
export const PUNICOES_ROUTE        = "/punicoes";
export const CANCELAR_PARTIDA_ROUTE = "/cancelar-partida";

export const ESTADIOS_ROUTE = "/estadios";
export const ADICIONAR_ESTADIO_ROUTE = "/adicionar-estadio";