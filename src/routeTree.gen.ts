/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as SettingsIndexRouteImport } from './routes/settings/index'
import { Route as QuestionsIndexRouteImport } from './routes/questions/index'
import { Route as DocumentsIndexRouteImport } from './routes/documents/index'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const SettingsIndexRoute = SettingsIndexRouteImport.update({
  id: '/settings/',
  path: '/settings/',
  getParentRoute: () => rootRouteImport,
} as any)
const QuestionsIndexRoute = QuestionsIndexRouteImport.update({
  id: '/questions/',
  path: '/questions/',
  getParentRoute: () => rootRouteImport,
} as any)
const DocumentsIndexRoute = DocumentsIndexRouteImport.update({
  id: '/documents/',
  path: '/documents/',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/documents': typeof DocumentsIndexRoute
  '/questions': typeof QuestionsIndexRoute
  '/settings': typeof SettingsIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/documents': typeof DocumentsIndexRoute
  '/questions': typeof QuestionsIndexRoute
  '/settings': typeof SettingsIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/documents/': typeof DocumentsIndexRoute
  '/questions/': typeof QuestionsIndexRoute
  '/settings/': typeof SettingsIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/documents' | '/questions' | '/settings'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/documents' | '/questions' | '/settings'
  id: '__root__' | '/' | '/documents/' | '/questions/' | '/settings/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DocumentsIndexRoute: typeof DocumentsIndexRoute
  QuestionsIndexRoute: typeof QuestionsIndexRoute
  SettingsIndexRoute: typeof SettingsIndexRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/settings/': {
      id: '/settings/'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsIndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/questions/': {
      id: '/questions/'
      path: '/questions'
      fullPath: '/questions'
      preLoaderRoute: typeof QuestionsIndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/documents/': {
      id: '/documents/'
      path: '/documents'
      fullPath: '/documents'
      preLoaderRoute: typeof DocumentsIndexRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DocumentsIndexRoute: DocumentsIndexRoute,
  QuestionsIndexRoute: QuestionsIndexRoute,
  SettingsIndexRoute: SettingsIndexRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
