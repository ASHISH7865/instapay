'use client';

import { ResetIcon } from '@radix-ui/react-icons';
import { CheckIcon, MoonIcon, Settings2, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { ListBox, ListBoxItem } from 'react-aria-components';

import { useThemeGenerator } from '@/lib/themes/use-theme-generator';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { Label } from '@/components/ui/label';
// TODO: Change listboxes to use radio groups
// TODO: Fix selected key issue (^ solved by above)

export function ThemeCustomizer({
  hide = false,
  shrink = false,
}: {
  shrink?: boolean;
  hide?: boolean;
}) {
  const { setTheme: setMode, resolvedTheme: mode } = useTheme();

  const {
    currentBorderRadius,
    borderRadius,
    updateBorderRadius,
    updateGrayColor,
    currentGrayColor,
    grayColors,
    currentAccentColor,
    themes,
    updateAccentColor,
    reset,
  } = useThemeGenerator();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className={cn(
            shrink && 'h-9 w-9 p-0 sm:h-9 sm:w-auto sm:px-4 sm:py-2',
          )}
        >
          <Settings2 className={cn('mr-2', shrink && 'mr-0 sm:mr-2')} />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-3/4 p-4 pb-0">
        <div className="flex h-full max-h-full flex-col overflow-hidden">
          <div className="flex items-start border-b border-border pb-4">
            <div className="space-y-1 pr-2">
              <div className="font-semibold leading-none tracking-tight">
                Customize
              </div>
              <div className="text-xs text-muted-foreground">
                Pick a style and color for your components.
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <>
              <div className="flex flex-1 flex-col space-y-4 overflow-y-auto px-1 py-3 md:space-y-6">
                <div className="space-y-1.5">
                  <Label className="text-xs">Base Color</Label>
                  <ListBox
                    aria-label="Base Colors"
                    className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={[currentGrayColor]}
                    onSelectionChange={key => {
                      //@ts-expect-error needs fixing
                      if (key.currentKey) updateGrayColor(key.currentKey);
                    }}
                  >
                    {grayColors.map(theme => {
                      return (
                        <ListBoxItem
                          textValue={theme.name}
                          id={theme.name}
                          key={theme.name}
                          className={cn(
                            buttonVariants({
                              size: 'sm',
                              variant: 'outline',
                              className: 'justify-start text-xs cursor-pointer',
                            }),
                          )}
                        >
                          {({ isSelected }) => (
                            <>
                              <span
                                className={cn(
                                  'mr-1 flex h-4 w-4 shrink-0 -translate-x-1 items-center justify-center rounded-full ',
                                  theme.name,
                                )}
                              >
                                {isSelected && (
                                  <CheckIcon
                                    className={cn(
                                      'h-3 w-3 text-white',
                                      theme.name === 'zinc' && 'text-black',
                                    )}
                                  />
                                )}
                              </span>
                              {theme.label}
                            </>
                          )}
                        </ListBoxItem>
                      );
                    })}
                  </ListBox>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Accent Color</Label>
                  <ListBox
                    aria-label="Accent Colors"
                    className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={[currentAccentColor]}
                    onSelectionChange={key => {
                      //@ts-expect-error needs fixing
                      if (key.currentKey) {
                        //@ts-expect-error needs fixing
                        updateAccentColor(key.currentKey);
                      }
                    }}
                  >
                    {themes.map(theme => {
                      return (
                        <ListBoxItem
                          textValue={theme.name}
                          id={theme.name}
                          key={theme.name}
                          className={cn(
                            buttonVariants({
                              variant: 'outline',
                              size: 'sm',
                              className: 'justify-start cursor-pointer',
                            }),
                          )}
                        >
                          {({ isSelected }) => (
                            <>
                              <span
                                className={cn(
                                  'mr-1 flex h-4 w-4 shrink-0 -translate-x-1 items-center justify-center rounded-full',
                                  theme.name,
                                )}
                              >
                                {isSelected && (
                                  <CheckIcon
                                    className={cn(
                                      'h-3 w-3 text-white',
                                      theme.name === 'zinc' && 'text-black',
                                    )}
                                  />
                                )}
                              </span>
                              {theme.label}
                            </>
                          )}
                        </ListBoxItem>
                      );
                    })}
                  </ListBox>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Radius</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {borderRadius.map(value => {
                      return (
                        <Button
                          variant={'outline'}
                          size="sm"
                          key={value}
                          onClick={() => {
                            updateBorderRadius(value);
                          }}
                          className={cn(
                            currentBorderRadius === value &&
                              'border-2 border-primary',
                          )}
                        >
                          {value}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Mode</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <>
                      <Button
                        variant={'outline'}
                        size="sm"
                        onClick={() => setMode('light')}
                        className={cn(
                          mode === 'light' && 'border-2 border-primary',
                        )}
                      >
                        <SunIcon className="mr-1 h-4 w-4 -translate-x-1" />
                        Light
                      </Button>
                      <Button
                        variant={'outline'}
                        size="sm"
                        onClick={() => setMode('dark')}
                        className={cn(
                          mode === 'dark' && 'border-2 border-primary',
                        )}
                      >
                        <MoonIcon className="mr-1 h-4 w-4 -translate-x-1" />
                        Dark
                      </Button>
                    </>
                  </div>
                </div>
              </div>
            </>
          </div>
          <div className="flex justify-end gap-4 border-t border-border py-4">
            <Button
              variant="secondary"
              className="rounded-[0.5rem]"
              onClick={() => {
                reset();
              }}
            >
              <ResetIcon className="mr-2" /> Reset
              <span className="sr-only">Reset</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
