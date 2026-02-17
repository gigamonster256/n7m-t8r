{

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs =
    { nixpkgs, ... }@inputs:
    let
      inherit (nixpkgs) lib;
      systems = [ "x86_64-linux" ];
      forAllSystems = f: lib.genAttrs systems (s: f nixpkgs.legacyPackages.${s});
    in
    {
      formatter = forAllSystems (pkgs: pkgs.nixfmt-tree);
      devShells = forAllSystems (pkgs: {
        default = import ./shell.nix { inherit pkgs; };
      });
      packages = forAllSystems (pkgs: {
        default = pkgs.callPackage ./package.nix { };
      });
      overlays = {
        default = final: _prev: final.callPackage ./package.nix { };
      };
    };
}
