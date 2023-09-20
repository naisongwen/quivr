/* eslint-disable max-lines */

import { UUID } from "crypto";
import { useTranslation } from "react-i18next";
import { FaSpinner } from "react-icons/fa";

import Button from "@/lib/components/ui/Button";
import { Chip } from "@/lib/components/ui/Chip";
import { Divider } from "@/lib/components/ui/Divider";
import Field from "@/lib/components/ui/Field";
import { TextArea } from "@/lib/components/ui/TextArea";
import { defineMaxTokens } from "@/lib/helpers/defineMaxTokens";
import { SaveButton } from "@/shared/SaveButton";

import { PublicPrompts } from "./components/PublicPrompts/PublicPrompts";
import { useSettingsTab } from "./hooks/useSettingsTab";

type SettingsTabProps = {
  brainId: UUID;
};

export const SettingsTab = ({ brainId }: SettingsTabProps): JSX.Element => {
  const { t } = useTranslation(["translation", "brain", "config"]);
  const {
    handleSubmit,
    register,
    temperature,
    maxTokens,
    model,
    setAsDefaultBrainHandler,
    isSettingAsDefault,
    isUpdating,
    isDefaultBrain,
    formRef,
    promptId,
    pickPublicPrompt,
    removeBrainPrompt,
    accessibleModels,
    brain,
  } = useSettingsTab({ brainId });

  const isPubliclyAccessible = brain?.status === "public";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(true);
      }}
      className="my-10 mb-0 flex flex-col items-center gap-2"
      ref={formRef}
    >
      <div className="flex flex-row flex-1 justify-between w-full items-end">
        <div>
          <Field
            label={t("brainName", { ns: "brain" })}
            placeholder={t("brainNamePlaceholder", { ns: "brain" })}
            autoComplete="off"
            className="flex-1"
            required
            disabled={isPubliclyAccessible}
            {...register("name")}
          />
        </div>

        <div className="mt-4">
          <div className="flex flex-1 items-center flex-col">
            {isPubliclyAccessible && (
              <Chip className="mb-3 bg-purple-600 text-white w-full">
                {t("brain:public_brain_label")}
              </Chip>
            )}
            {isDefaultBrain ? (
              <div className="border rounded-lg border-dashed border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:bg-black dark:focus:bg-white dark dark focus:text-white dark:focus:text-black transition-colors py-2 px-4 shadow-none">
                {t("defaultBrain", { ns: "brain" })}
              </div>
            ) : (
              <Button
                variant={"secondary"}
                isLoading={isSettingAsDefault}
                onClick={() => void setAsDefaultBrainHandler()}
                type="button"
                disabled={isPubliclyAccessible}
              >
                {t("setDefaultBrain", { ns: "brain" })}
              </Button>
            )}
          </div>
        </div>
      </div>
      <TextArea
        label={t("brainDescription", { ns: "brain" })}
        placeholder={t("brainDescriptionPlaceholder", { ns: "brain" })}
        autoComplete="off"
        className="flex-1 m-3"
        disabled={isPubliclyAccessible}
        {...register("description")}
      />
      <Divider text={t("modelSection", { ns: "config" })} />
      <Field
        label={t("openAiKeyLabel", { ns: "config" })}
        placeholder={t("openAiKeyPlaceholder", { ns: "config" })}
        autoComplete="off"
        className="flex-1"
        disabled={isPubliclyAccessible}
        {...register("openAiKey")}
      />
      <fieldset className="w-full flex flex-col mt-2">
        <label className="flex-1 text-sm" htmlFor="model">
          {t("modelLabel", { ns: "config" })}
        </label>
        <select
          id="model"
          disabled={isPubliclyAccessible}
          {...register("model")}
          className="px-5 py-2 dark:bg-gray-700 bg-gray-200 rounded-md"
          onChange={() => {
            void handleSubmit(false); // Trigger form submission
          }}
        >
          {accessibleModels.map((availableModel) => (
            <option value={availableModel} key={availableModel}>
              {availableModel}
            </option>
          ))}
        </select>
      </fieldset>
      <fieldset className="w-full flex mt-4">
        <label className="flex-1" htmlFor="temp">
          {t("temperature", { ns: "config" })}: {temperature}
        </label>
        <input
          id="temp"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={temperature}
          disabled={isPubliclyAccessible}
          {...register("temperature")}
        />
      </fieldset>
      <fieldset className="w-full flex mt-4">
        <label className="flex-1" htmlFor="tokens">
          {t("maxTokens", { ns: "config" })}: {maxTokens}
        </label>
        <input
          type="range"
          min="10"
          max={defineMaxTokens(model)}
          value={maxTokens}
          disabled={isPubliclyAccessible}
          {...register("maxTokens")}
        />
      </fieldset>
      <div className="flex w-full justify-end py-4">
        <SaveButton
          disabled={isPubliclyAccessible}
          handleSubmit={handleSubmit}
        />
      </div>
      <Divider text={t("customPromptSection", { ns: "config" })} />
      {!isPubliclyAccessible && <PublicPrompts onSelect={pickPublicPrompt} />}
      <Field
        label={t("promptName", { ns: "config" })}
        placeholder={t("promptNamePlaceholder", { ns: "config" })}
        autoComplete="off"
        className="flex-1"
        disabled={isPubliclyAccessible}
        {...register("prompt.title")}
      />
      <TextArea
        label={t("promptContent", { ns: "config" })}
        placeholder={t("promptContentPlaceholder", { ns: "config" })}
        autoComplete="off"
        className="flex-1"
        disabled={isPubliclyAccessible}
        {...register("prompt.content")}
      />
      <div className="flex w-full justify-end py-4">
        <SaveButton
          disabled={isPubliclyAccessible}
          handleSubmit={handleSubmit}
        />
      </div>
      {promptId !== "" && (
        <Button
          disabled={isUpdating || isPubliclyAccessible}
          onClick={() => void removeBrainPrompt()}
        >
          {t("removePrompt", { ns: "config" })}
        </Button>
      )}
      <div className="flex flex-row justify-end flex-1 w-full mt-8">
        {isUpdating && <FaSpinner className="animate-spin" />}
        {isUpdating && (
          <span className="ml-2 text-sm">
            {t("updatingBrainSettings", { ns: "config" })}
          </span>
        )}
      </div>
    </form>
  );
};
