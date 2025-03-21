import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import DynamicSelection from "@/components/CreateAccount/DynamicSelection";
import { useCreateAccountStore } from "@/store/useCreateAccountStore";
import SliderHowManyTimes from "@/components/CreateAccount/SliderHowManyTimes";

const bodyTypes = [
  {
    label: "Slim",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2Ft2JoubbDtBW0KvYg8RmFZ%2Fimages%2Fbody-muscles%2FSLIM_SHREDDED_BODY.png&w=256&q=55",
  },
  {
    label: "Average",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2Ft2JoubbDtBW0KvYg8RmFZ%2Fimages%2Fbody-fat-level%2FFROM_15_TO_19.png&w=256&q=55",
  },
  {
    label: "Heavy",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2Ft2JoubbDtBW0KvYg8RmFZ%2Fimages%2Fbody-fat-level%2FFROM_25_TO_29.png&w=256&q=55",
  },
];

const ageGroups = [
  {
    label: "Age: 18-29",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F18-29v5.0024e0ba.png&w=384&q=100",
  },
  {
    label: "Age: 30-39",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F30-39v5.e6724dfb.png&w=384&q=100",
  },
  {
    label: "Age: 40-49",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F40-49v5.fa977b7b.png&w=384&q=100",
  },
  {
    label: "Age: 50+",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F50%2Bv5.76f38f2b.png&w=384&q=100",
  },
];

const yourGoal = [
  {
    label: "Lose Weight",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2Ft2JoubbDtBW0KvYg8RmFZ%2Fimages%2Fbody-muscles%2FSLIM_SHREDDED_BODY.png&w=256&q=55",
  },
  {
    label: "Gain Muscle Mass",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2Ft2JoubbDtBW0KvYg8RmFZ%2Fimages%2Fbody-muscles%2FHERO.png&w=256&q=55",
  },
  {
    label: "Get Shredded",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2Ft2JoubbDtBW0KvYg8RmFZ%2Fimages%2Fbody-muscles%2FBEACH_BODY.png&w=256&q=55",
  },
];

const selectedLoseWeight = [
  {
    label: "Slim Body",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FSLIM_BODY.png&w=256&q=55",
  },
  {
    label: "Slim,Shredded Body",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FSLIM_SHREDDED_BODY.png&w=256&q=55",
  },
];

const selectedGainMuscle = [
  {
    label: "Athlete",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FATHLETE.png&w=256&q=55",
  },
  {
    label: "Hero",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FHERO.png&w=256&q=55",
  },
  {
    label: "BodyBuilder",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FBODYBUILDER.png&w=256&q=55",
  },
];

const selectedGetShredded = [
  {
    label: "Beach Body",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FBEACH_BODY.png&w=256&q=55",
  },
  {
    label: "Wourkout Body",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FWORKOUT_BODY.png&w=256&q=55",
  },
  {
    label: "CrossFit Body",
    image:
      "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FCROSS_FIT_BODY.png&w=256&q=55",
  },
];

export default function CreateAccount() {
  const store = useCreateAccountStore();

  useEffect(() => {
    console.log("Store State:", store);
  }, [store.selectedBodyType, store.selectedAgeGroup, store.selectedGoal]);

  return (
    <Routes>
      <Route
        path="body-type"
        element={
          <DynamicSelection
            title="Choose your body type"
            description="Select according to your body structure"
            data={bodyTypes}
            linkPrefix="/create-account/body-type"
            nextLink="/create-account/your-goal"
            prevLink="/create-account/age-selection"
            imageHeight={30}
          />
        }
      />
      <Route
        path="age-selection"
        element={
          <DynamicSelection
            title="Select Your Age Group"
            description="Choose the age range that fits you best"
            data={ageGroups}
            linkPrefix="/create-account/age-selection"
            prevLink="/"
            nextLink="/create-account/body-type"
          />
        }
      />
      <Route
        path="your-goal"
        element={
          <DynamicSelection
            title="Select Your Goal"
            description="Choose your goal that you want to reach"
            data={yourGoal}
            linkPrefix="/create-account/your-goal"
            prevLink="/create-account/body-type"
            nextLink="/create-account/body-you-want"
            imageHeight={30}
          />
        }
      />
      <Route
        path="body-you-want"
        element={
          <DynamicSelection
            title="Choose the body you want"
            description={`Ok, so your goal is ${store.selectedGoal}`}
            data={
              store.selectedGoal === "Lose Weight"
                ? selectedLoseWeight
                : store.selectedGoal === "Gain Muscle Mass"
                ? selectedGainMuscle
                : selectedGetShredded
            }
            linkPrefix="/create-account/body-you-want"
            prevLink="/create-account/your-goal"
            nextLink="/create-account/how-many-times"
            imageHeight={30}
          />
        }
      />

      <Route path="how-many-times" element={<SliderHowManyTimes />} />
    </Routes>
  );
}
