import { IExercise } from "./exercise-obj";

export interface IConfigPath {
  base: string;
}

export interface IEditor {
  mode: string;
  version: string;
  agent?: string;
}

export type TCompiler =
  | "webpack"
  | "vanillajs"
  | "vue"
  | "react"
  | "css"
  | "html";

export type TGrading = "isolated" | "incremental" | "no-grading";

export interface IConfig {
  mode?: any;
  port?: string;
  repository?: string;
  description?: string;
  slug?: string;
  address: string;
  dirPath: string;
  preview?: string;
  entries: any;
  grading: TGrading;
  confPath: IConfigPath;
  configPath: string;
  translations: Array<string>;
  outputPath?: string;
  editor: IEditor;
  language: string;
  title: string;
  duration: number;
  difficulty?: string;
  exercisesPath: string;
  actions: Array<any>;
  disableGrading: boolean;
  disabledActions?: Array<string>;
  compiler: TCompiler;
  exercises?: Array<IExercise>;
  currentExercise?: IExercise;
  publicPath: string;
  publicUrl?: string;
  graded: boolean;
  skills: Array<string>;
  session: number;
  runHook: (...agrs: Array<any>) => void;
  testingFinishedCallback: (arg: any | undefined) => void;
}

export type TConfigObjAttributes = "config" | "exercises" | "grading";

export interface IConfigObj {
  currentExercise?: any;
  config?: IConfig;
  exercises?: Array<IExercise>;
}
