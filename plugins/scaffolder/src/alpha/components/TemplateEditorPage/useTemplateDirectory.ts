/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useCallback } from 'react';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';

import {
  WebFileSystemAccess,
  WebFileSystemStore,
  WebDirectoryAccess,
} from '../../../lib/filesystem';
import { createExampleTemplate } from '../../../lib/filesystem/createExampleTemplate';

export function useTemplateDirectory(): {
  directory?: WebDirectoryAccess;
  loading: boolean;
  error?: Error;
  handleOpenDirectory: () => void;
  handleCreateDirectory: () => void;
  handleCloseDirectory: () => void;
} {
  const { value, loading, error, retry } = useAsyncRetry(async () => {
    const directory = await WebFileSystemStore.getDirectory();
    if (!directory) return undefined;
    return WebFileSystemAccess.fromHandle(directory);
  }, []);

  const handleOpenDirectory = useCallback(() => {
    WebFileSystemAccess.requestDirectoryAccess()
      .then(WebFileSystemStore.setDirectory)
      .then(retry);
  }, [retry]);

  const handleCreateDirectory = useCallback(() => {
    WebFileSystemAccess.requestDirectoryAccess()
      .then(createExampleTemplate)
      .then(WebFileSystemStore.setDirectory)
      .then(retry);
  }, [retry]);

  const handleCloseDirectory = useCallback(() => {
    WebFileSystemStore.setDirectory(undefined).then(retry);
  }, [retry]);

  return {
    directory: value,
    loading,
    error,
    handleOpenDirectory,
    handleCreateDirectory,
    handleCloseDirectory,
  };
}
