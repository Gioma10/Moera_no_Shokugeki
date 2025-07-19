"use client";
import FormVote from "../../components/FormVote";
import Input from "../../components/Input";


const CreateRecipe = () => {

  return (
    <div className="h-screen flex justify-center flex-col items-center gap-5">
      <h2 className="text-5xl">Crea una ricetta</h2>
      <form action="" className="p-10 bg-amber-50 rounded-4xl">
        <div className="flex items-center gap-10">
          <div className="flex flex-col gap-2">
            <Input type="text" placeholder="Title" input="input" />
            <Input type="" placeholder="Type" input="select" />
          </div>
          <div className="flex flex-col gap-2">
            <img
              src="https://picsum.photos/200/200"
              alt="Recipe photo"
              className=" rounded-2xl"
            />
            <FormVote />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;
