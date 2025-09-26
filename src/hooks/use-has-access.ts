import { useAuth } from '@/hooks/use-auth'

import type { ModuleType } from '@/lib/menu'

type LooseAutocomplete<T extends string> = T | Omit<string, T>
type AccessType = LooseAutocomplete<'read' | 'write'>

type HasAccessFn = (module: ModuleType | ModuleType[], requiredPermission: AccessType) => boolean

export const useHasAccess = (): [HasAccessFn] => {
  const { sessionInfo } = useAuth()

  const hasAccess: HasAccessFn = (module, requiredPermission) => {
    if (requiredPermission !== 'read' && requiredPermission !== 'write') {
      return false
    }

    if (!sessionInfo?.roles.length) {
      return false
    }

    const moduleList = Array.isArray(module) ? module : [module]

    return sessionInfo.roles.some((role) =>
      role.scopes.some(
        (scope) =>
          moduleList.includes(scope.module.name as ModuleType) &&
          [requiredPermission, '*'].includes(scope.accessType.toLowerCase()),
      ),
    )
  }

  return [hasAccess]
}

// Hook to check **read permission**
export const useHasReadAccess = (module: ModuleType | ModuleType[]): boolean => {
  const [hasAccess] = useHasAccess()
  return hasAccess(module, 'read')
}

// Hook to check **write permission**
export const useHasWriteAccess = (module: ModuleType | ModuleType[]): boolean => {
  const [hasAccess] = useHasAccess()
  return hasAccess(module, 'write')
}
