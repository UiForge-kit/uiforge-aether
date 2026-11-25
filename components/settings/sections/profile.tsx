"use client";

import { useState } from "react";
import {
  Alert02Icon,
  GithubIcon,
  Linkedin01Icon,
  Link04Icon,
  NewTwitterIcon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@/components/icon";
import { AvatarPicker } from "@/components/settings/avatar-picker";
import { Card, Labelled } from "@/components/settings/primitives";
import { UserAvatar } from "@/components/user/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_USER } from "@/lib/mock/user";
import { useProfileStore } from "@/store/profile-store";
import type { SocialId } from "@/types/profile";

const SOCIALS: Array<{ id: SocialId; label: string; icon: IconSvgElement; placeholder: string }> = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin01Icon, placeholder: "linkedin.com/in/…" },
  { id: "github", label: "GitHub", icon: GithubIcon, placeholder: "github.com/…" },
  { id: "x", label: "X", icon: NewTwitterIcon, placeholder: "x.com/…" },
  { id: "website", label: "Site personnel", icon: Link04Icon, placeholder: "https://…" },
];

export function ProfileSection() {
  const { nickname, bio, phone, avatarId, socials, set } = useProfileStore();
  const [picking, setPicking] = useState(false);

  const setSocial = (id: SocialId, value: string) =>
    set("socials", { ...socials, [id]: value });

  return (
    <>
      <Card
        title=""
        description=""
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="focus-visible:ring-ring/50 group relative rounded-2xl outline-none focus-visible:ring-3"
          >
            <UserAvatar className="size-16 rounded-2xl text-xl" />
            <span className="bg-foreground/60 absolute inset-0 grid place-items-center rounded-2xl text-[0.6875rem] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              Changer
            </span>
          </button>

          <div className="min-w-0">
            <p className="font-medium">{MOCK_USER.name}</p>
            <p className="text-muted-foreground truncate text-sm">{MOCK_USER.email}</p>
            {MOCK_USER.organization && (
              <Badge variant="secondary" className="mt-1">
                {MOCK_USER.organization}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <Labelled
            label="Comment souhaitez-vous qu'on vous appelle ?"
            hint="repris par le modèle"
          >
            <Input
              value={nickname}
              onChange={(event) => set("nickname", event.target.value)}
              placeholder={MOCK_USER.name.split(" ")[0]}
              className="h-9"
            />
          </Labelled>

          <Labelled label="Votre description" hint="ajoutée au contexte de chaque conversation">
            <Textarea
              value={bio}
              onChange={(event) => set("bio", event.target.value)}
              placeholder="Designer produit, je travaille surtout sur des interfaces B2B et je préfère les réponses directes."
              rows={3}
              className="max-h-40 text-[0.8125rem]"
            />
          </Labelled>

          <Labelled label="Numéro associé au compte" hint="pour la double authentification">
            <div className="relative">
              <Icon
                icon={SmartPhone01Icon}
                size={15}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
              />
              <Input
                type="tel"
                value={phone}
                onChange={(event) => set("phone", event.target.value)}
                placeholder="+242 06 000 00 00"
                className="h-9 pl-8"
              />
            </div>
          </Labelled>
        </div>
      </Card>

      <Card
        title="Comptes liés"
        description="Utilisés pour signer vos publications et pré-remplir vos contextes."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {SOCIALS.map((social) => (
            <Labelled key={social.id} label={social.label}>
              <div className="relative">
                <Icon
                  icon={social.icon}
                  size={15}
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
                />
                <Input
                  value={socials[social.id]}
                  onChange={(event) => setSocial(social.id, event.target.value)}
                  placeholder={social.placeholder}
                  className="h-9 pl-8"
                />
              </div>
            </Labelled>
          ))}
        </div>
      </Card>

      <DangerZone />

      <AvatarPicker
        open={picking}
        onOpenChange={setPicking}
        value={avatarId}
        onSelect={(id) => set("avatarId", id)}
      />
    </>
  );
}

const CONFIRM_WORD = "SUPPRIMER";

function DangerZone() {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const reset = useProfileStore((state) => state.reset);

  return (
    <>
      <Card
        title="Supprimer le compte"
        description="Conversations, projets et intégrations sont effacés définitivement."
      >
        <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
          <Icon icon={Alert02Icon} size={14} />
          Supprimer mon compte
        </Button>
      </Card>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setConfirmation("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer définitivement le compte</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Toutes les données associées à ce compte
              seront supprimées de cet appareil.
            </DialogDescription>
          </DialogHeader>

          <Labelled label={`Saisissez « ${CONFIRM_WORD} » pour confirmer`}>
            <Input
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className="h-9 font-mono"
              autoComplete="off"
            />
          </Labelled>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={confirmation !== CONFIRM_WORD}
              onClick={() => {
                reset();
                setOpen(false);
                setConfirmation("");
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
