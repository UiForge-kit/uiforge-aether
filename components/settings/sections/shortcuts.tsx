"use client";

import { Card } from "@/components/settings/primitives";
import { Kbd } from "@/components/ui/kbd";
import { MODULES } from "@/config/modules";
import { SHORTCUTS, SHORTCUT_GROUPS } from "@/config/shortcuts";

const ALL_SHORTCUTS = [...SHORTCUTS, ...MODULES.flatMap((module) => module.shortcuts ?? [])];

export function ShortcutsSection() {
  return (
    <Card title="Raccourcis clavier" description="⌘ sur macOS, Ctrl ailleurs.">
      <div className="space-y-5">
        {SHORTCUT_GROUPS.map((group) => (
          <div key={group}>
            <h4 className="label-caps mb-2">{group}</h4>
            <ul>
              {ALL_SHORTCUTS.filter((shortcut) => shortcut.group === group).map((shortcut) => (
                <li
                  key={shortcut.id}
                  className="border-border flex items-center justify-between gap-4 border-b py-2 text-[0.8125rem] last:border-0"
                >
                  <span>{shortcut.label}</span>
                  <Kbd keys={shortcut.keys} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
