{
  lib,
  buildNpmPackage,
  importNpmLock,
  imagemagick,
}:
buildNpmPackage (finalAttrs: {
  pname = "n7m-t8r";
  inherit (lib.importJSON ./package.json) version;

  src = lib.fileset.toSource {
    root = ./.;
    fileset = lib.fileset.intersection (lib.fileset.fromSource (lib.sources.cleanSource ./.)) (
      lib.fileset.unions [
        ./assets
        ./scripts
        ./src
        ./package.json
        ./package-lock.json
        ./vite.config.js
      ]
    );
  };

  npmDeps = importNpmLock { npmRoot = finalAttrs.src; };
  inherit (importNpmLock) npmConfigHook;

  nativeBuildInputs = [ imagemagick ];

  installPhase = ''
    mkdir -p $out/share/n7m-t8r
    cp -r dist/* $out/share/n7m-t8r/
  '';
})
