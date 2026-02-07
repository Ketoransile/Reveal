import { createClient } from "@/lib/supabase/server";
import { FloatingNav } from "./floating-nav";

export async function NavBar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let validUser = user;

    if (user) {
        // Verify user actually exists in our database
        // If they were deleted from 'users' table but still exist in Auth, 
        // we shouldn't show them as logged in.
        const { data: profile } = await supabase
            .from('users')
            .select('id')
            .eq('id', user.id)
            .single();

        if (!profile) {
            validUser = null;
        }
    }

    return <FloatingNav user={validUser} />;
}
