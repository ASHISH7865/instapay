import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import {
  syncBorderRadius,
  syncFontFamily,
  syncGrayColor,
  syncThemeColor,
} from '@/lib/themes/use-theme-generator'
import { useThemeStore } from '@/lib/themes/use-theme-store'
import { useEffect } from 'react'

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const currentGrayColor = useThemeStore((state) => state.grayColor)
  const currentAccentColor = useThemeStore((state) => state.accentColor)
  const currentFontFamily = useThemeStore((state) => state.fontFamily)
  const currentBorderRadius = useThemeStore((state) => state.borderRadius)

  useEffect(() => {
    syncGrayColor(currentGrayColor, resolvedTheme)
  }, [currentGrayColor, resolvedTheme])

  useEffect(() => {
    syncThemeColor(currentAccentColor, resolvedTheme)
  }, [currentAccentColor, resolvedTheme])

  useEffect(() => {
    syncFontFamily(currentFontFamily)
  }, [currentFontFamily])

  useEffect(() => {
    syncBorderRadius(currentBorderRadius)
  }, [currentBorderRadius])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='ghost'>
          <Sun className='h-[1.1rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.1rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
