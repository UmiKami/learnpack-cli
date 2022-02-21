import {IExercise} from './exercise-obj'

export interface IConfigPath {
  base: string;
}

export interface IEditor {
  mode: string;
  version: string;
  agent?: string;
}

export type TCompiler =
  | 'webpack'
  | 'vanillajs'
  | 'vue'
  | 'react'
  | 'css'
  | 'html';

export type TGrading = 'isolated' | 'incremental' | 'no-grading';

export interface IConfig {
  mode?: any;
  port?: string;
  address: string;
  dirPath: string;
  entries: any;
  grading: TGrading;
  confPath: IConfigPath;
  configPath: string;
  translations: Array<string>;
  outputPath?: string;
  editor: IEditor;
  exercisesPath: string;
  actions: Array<any>;
  disableGrading: boolean;
  disabledActions?: Array<string>;
  compiler: TCompiler;
  exercises?: Array<IExercise>;
  currentExercise?: IExercise;
  publicUrl?: string;
  runHook: (...agrs: Array<any>) => void;
}

export type TConfigObjAttributes = 'config' | 'exercises' | 'grading';

export interface IConfigObj {
  currentExercise?: any;
  config?: IConfig;
  exercises?: Array<IExercise>;
  grading?: TGrading;
  repository?: string;
  description?: string;
  slug?: string;
}
