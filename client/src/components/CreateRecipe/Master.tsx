import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ControllerProps } from "@/types/controllerProps";
import { FormControl, FormField, FormItem } from "../ui/form";

export const Master: React.FC<ControllerProps> = ({ name, control }) => {
	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => {
				console.log(field.value);
				return (
					<FormItem>
						<FormControl>
							<div className="flex flex-row items-center gap-2 w-[200px] ">
								<div
									onClick={() => field.onChange("nowy")}
									className="flex-1 flex justify-center border rounded-md shadow-xs cursor-pointer"
								>
									<Image
										src="/images/nowy.png"
										alt="Nowy"
										width={35}
										height={35}
										className={cn(
											"transition-all duration-300 grayscale",
											field.value === "nowy" && "grayscale-0",
										)}
									/>
								</div>

								<div
									onClick={() => field.onChange("moe")}
									className="flex-1 flex justify-center border rounded-md shadow-xs cursor-pointer"
								>
									<Image
										src="/images/moe.png"
										alt="Moe"
										width={35}
										height={35}
										className={cn(
											"transition-all duration-300 grayscale",
											field.value === "moe" && "grayscale-0",
										)}
									/>
								</div>
							</div>
						</FormControl>
					</FormItem>
				);
			}}
		/>
	);
};
