import * as React from "react"

import {
  defaultBadgeState,
  loadBadgeState,
  saveBadgeState,
  type BadgeState,
} from "@/lib/badge-state"

export function useBadgeState() {
  const [badge, setBadge] = React.useState<BadgeState>(loadBadgeState)

  React.useEffect(() => {
    saveBadgeState(badge)
  }, [badge])

  const updateBadge = React.useCallback(
    <Key extends keyof BadgeState>(key: Key, value: BadgeState[Key]) => {
      setBadge((current) => ({ ...current, [key]: value }))
    },
    []
  )

  const resetBadge = React.useCallback(() => {
    setBadge(defaultBadgeState)
  }, [])

  return { badge, updateBadge, resetBadge }
}
