YouTube - playlist manager
==========================

![thumbnail](https://github.com/Mr21/YouTube-Playlists-Manager/blob/gh-pages/thumbnail.jpg)

**V1**
- [X] <s>Forcer le **https**.</s>
- [X] <s>Lancer la vidéo quand on **click milieu** dessus.</s>
- [X] <s>Mettre un **lien externe** pour accéder à la **PL** au lieu du nom.</s>
- [X] <s>Pouvoir **éditer le nom de la PL** en cliquant dessus.</s>
- [X] <s>Pouvoir modifier le `status.privacyStatus` d'une PL.</s>
- [X] <s>Styliser les **scrollbars**.</s>
- [X] <s>Faire en sorte que le **bg des PL** corresponde toujours à sa **première vidéo**.</s>
- [X] <s>Faire comprendre que le **titre des PL** peut etre edite lors du `focus`.</s>
- [X] <s>**Multi-Channels**</s>
  - [X] <s>Organisation par **onglets**.</s>
  - [X] <s>Pouvoir charger plusieurs **channels** différents.</s>
  - [X] <s>Mettre les channels autre que `Mine` en total **read-only**.</s>
  - [x] <s>Afficher le vrai nom du channel dans l'onglet `channelTitle`.</s>
  - [X] <s>Écrire en dessous du champs `channelName` si aucun channel n'a été trouvé OU si le channel est vide.</s>
- [X] **DOMdiff**
  - [X] <s>**Stocker** les infos: `name`, `status`, `videos` pour chaque PL.</s>
  - [X] <s>Mettre les boutons: **Cancel** et **Save** dans l'onglet `Mine`.</s>
  - [X] <s>Donner la possibilité d'**annuler** toutes les modifications.</s>
  - [X] <s>Coder une fonction `diff` generique.</s>
  - [X] <s>Coder le **DOMdiff** qui utilisera la fonction `diff`.</s>
  - [X] <s>Lancer les **requêtes** en prenant soin de **ré-écrire** les infos stockées dans chaque PL.</s>
  - [X] <s>Mettre un **spinneur** d'attente lors du **save**.</s>
- [X] <s>Rédiger la section **About**.</s>

**V2**
- [ ] Styliser les **infobulles**.
- [ ] **Suppression** d'une **playlist** via leur futur bouton `fa-trash`.
- [ ] **Suppression** des **vidéos** selectionnées avec la touche `delete`.
- [ ] **Ajout** d'une nouvelle **playlist** en cliquant sur un placeholder `fa-plus`.
- [ ] **Ajout** d'une nouvelle **video** dans une playlist en saisissant son `URL`.
- [ ] Pouvoir ouvrir son propre channel meme s'il est vide pour permettre de creer des playlists.
- [ ] **YouTube** (cool idee de _Misty_ <3)
  - [ ] Mettre un bouton pour partager l'écran en deux pour y mettre une **iframe vers YouTube**.
  - [ ] Permettre de **drag n drop** des vidéos d'une iframe vers l'autre (`HTML5`?).
