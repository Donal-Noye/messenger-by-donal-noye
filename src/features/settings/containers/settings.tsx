import {sessionService} from "@/entities/user/services/session";
import {SettingsClient} from "@/features/settings/containers/settings-client";

export async function Settings() {
	const { session } = await sessionService.verifySession();

	return (
		<SettingsClient {...session} />
	)
}