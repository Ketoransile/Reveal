import { createClient } from "@/lib/supabase/server";
import { FloatingNav } from "./floating-nav";

export function NavBar() {
    return <FloatingNav user={undefined} />;
}
