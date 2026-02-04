import { createClient } from "@/lib/supabase/server";
import { FloatingNav } from "./floating-nav";

export async function NavBar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return <FloatingNav user={user} />;
}
