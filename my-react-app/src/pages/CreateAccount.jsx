import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import DynamicSelection from "@/components/CreateAccount/DynamicSelection";
import WeightInput from "@/components/CreateAccount/WeightInput";
import HeightInput from "@/components/CreateAccount/HeightInput";
import SliderHowManyTimes from "@/components/CreateAccount/SliderHowManyTimes";
import { useCreateAccountStore } from "@/store/useCreateAccountStore";

// Gender images
import maleGender from "../assets/male_gender.png";
import femaleGender from "../assets/female_gender.png";

// Male images
import male1829 from "../assets/male_18_29.png";
import male3039 from "../assets/male_30_39.png";
import male4049 from "../assets/male_40_49.png";
import male50 from "../assets/male_50.png";
import maleSlim from "../assets/male_slim.png";
import maleAverage from "../assets/male-average.png";
import maleHeavy from "../assets/male_heavy.png";
import maleLoseWeight from "../assets/male_lose_weight.png";
import maleGainMuscle from "../assets/male_gain_muscle.png";
import maleGetShredded from "../assets/male_get_shredded.png";

// Female images
import female1829 from "../assets/female_18_29.png";
import female3039 from "../assets/female_30_39.png";
import female4049 from "../assets/female_40_49.png";
import female50 from "../assets/female_50.png";
import femaleSlim from "../assets/female_slim_body.png";
import femaleAverage from "../assets/female_average.png";
import femaleHeavy from "../assets/female_heavy.png";
import femaleLoseWeight from "../assets/female_lose_weight.png";
import femaleGainMuscle from "../assets/female_gain_muscle.png";
import femaleGetShredded from "../assets/female_get_shredded.png";

export default function CreateAccount() {
  const store = useCreateAccountStore();

  const selectedGender = store.selectedGender || "Male";

  const gender = [
    { label: "Male", image: maleGender },
    { label: "Female", image: femaleGender },
  ];

  const bodyTypes =
    selectedGender === "Female"
      ? [
          { label: "Slim", image: femaleSlim },
          { label: "Average", image: femaleAverage },
          { label: "Heavy", image: femaleHeavy },
        ]
      : [
          { label: "Slim", image: maleSlim },
          { label: "Average", image: maleAverage },
          { label: "Heavy", image: maleHeavy },
        ];

  const ageGroups =
    selectedGender === "Female"
      ? [
          { label: "Age: 18-29", image: female1829 },
          { label: "Age: 30-39", image: female3039 },
          { label: "Age: 40-49", image: female4049 },
          { label: "Age: 50+", image: female50 },
        ]
      : [
          { label: "Age: 18-29", image: male1829 },
          { label: "Age: 30-39", image: male3039 },
          { label: "Age: 40-49", image: male4049 },
          { label: "Age: 50+", image: male50 },
        ];

  const yourGoal =
    selectedGender === "Female"
      ? [
          { label: "Lose Weight", image: femaleLoseWeight },
          { label: "Gain Muscle Mass", image: femaleGainMuscle },
          { label: "Get Shredded", image: femaleGetShredded },
        ]
      : [
          { label: "Lose Weight", image: maleLoseWeight },
          { label: "Gain Muscle Mass", image: maleGainMuscle },
          { label: "Get Shredded", image: maleGetShredded },
        ];

  const selectedLoseWeight =
    selectedGender === "Female"
      ? [
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
        ]
      : [
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

  const selectedGainMuscle =
    selectedGender === "Female"
      ? [
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
        ]
      : [
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

  const selectedGetShredded =
    selectedGender === "Female"
      ? [
          {
            label: "Beach Body",
            image:
              "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FBEACH_BODY.png&w=256&q=55",
          },
          {
            label: "Workout Body",
            image:
              "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FWORKOUT_BODY.png&w=256&q=55",
          },
          {
            label: "CrossFit Body",
            image:
              "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FCROSS_FIT_BODY.png&w=256&q=55",
          },
        ]
      : [
          {
            label: "Beach Body",
            image:
              "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FBEACH_BODY.png&w=256&q=55",
          },
          {
            label: "Workout Body",
            image:
              "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FWORKOUT_BODY.png&w=256&q=55",
          },
          {
            label: "CrossFit Body",
            image:
              "https://madmuscles.com/_next/image?url=%2F_next%2Fstatic%2Fassets%2FaJuJ2fVCrgIDArhVE-ubV%2Fimages%2Fbody-muscles%2FCROSS_FIT_BODY.png&w=256&q=55",
          },
        ];

  useEffect(() => {
    console.log("Store State:", store);
  }, [
    store.selectedGender,
    store.selectedBodyType,
    store.selectedAgeGroup,
    store.selectedHeight,
    store.selectedWeight,
    store.selectedGoal,
  ]);

  return (
    <Routes>
      <Route
        path="gender"
        element={
          <DynamicSelection
            title="Choose your gender"
            description="Select your gender"
            data={gender}
            linkPrefix="/create-account/gender"
            nextLink="/create-account/age-selection"
            prevLink="/"
            imageHeight={30}
          />
        }
      />
      <Route
        path="body-type"
        element={
          <DynamicSelection
            title="Choose your body type"
            description="Select according to your body structure"
            data={bodyTypes}
            linkPrefix="/create-account/body-type"
            nextLink="/create-account/your-goal"
            prevLink="/create-account/weight"
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
            prevLink="/create-account/gender"
            nextLink="/create-account/height"
          />
        }
      />
      <Route
        path="height"
        element={
          <HeightInput
            type="height"
            prevLink="/create-account/age-selection"
            nextLink="/create-account/weight"
          />
        }
      />
      <Route
        path="weight"
        element={
          <WeightInput
            type="weight"
            prevLink="/create-account/height"
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
