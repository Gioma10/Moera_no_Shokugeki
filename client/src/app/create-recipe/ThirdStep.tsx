import type { UseFormReturn } from "react-hook-form";
import type z from "zod";
import { Master } from "@/components/CreateRecipe/Master";
import { Method } from "@/components/CreateRecipe/Method";
import {
	Note,
	Preparation,
} from "@/components/CreateRecipe/PreparationAndNote";
import type { RecipeSchema } from "@/types/recipes";

export const ThirdStep = ({
	form,
}: {
	form: UseFormReturn<z.infer<typeof RecipeSchema>>;
}) => {
	return (
		<div className="flex flex-col w-full gap-5">
			<div className="flex gap-5  justify-between">
				<Preparation name="preparation" control={form.control} />
				<Note name="note" control={form.control} />
			</div>
			<div className="flex justify-between">
				<Method name="method" control={form.control} />
				<div className="">
					<Master name="master" control={form.control} />
				</div>
			</div>
		</div>
	);
};
