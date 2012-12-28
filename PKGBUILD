# Maintainer: Philipp Klein <philipptheklein@gmail.com>

pkgname=vino-bill
pkgver=1.0
pkgrel=1
pkgdesc="A web based invoice management tool for winemakers"
arch=('any')
url="https://github.com/kleinph/vino-bill"
license=('GPL')
depends=('django')
makedepends=('git')
optdepends=('cups: printing support')
backup=(var/lib/"$pkgname"/database.db)
options=()
install=vino-bill.install
#source=(git://github.com/kleinph/vino-bill.git#branch=release)
md5sums=()

_gitroot=git://github.com/kleinph/"$pkgname".git
_gitbranch=release

build() {
  cd "$srcdir"
  msg "Connecting to GIT server...."

  if [[ -d "$pkgname" ]]; then
    cd "$pkgname" && git pull origin
    msg "The local files are updated."
  else
    git clone "$_gitroot" "$pkgname" --branch "$_gitbranch" --depth=1
  fi

  msg "GIT checkout done or server timeout"
}

# only usable with pacman >= 4.1
pkgver() {
  cd "$srcdir/$pkgname"
  echo $(git describe --always | sed 's/-/./g')
  # for git, if the repo has no tags, comment out the above and uncommnet the next line:
  #echo "$(git shortlog | grep -c '\s\+').$(git describe --always)"
  # This will give you a count of the total commits and the hash of the commit you are on.
  # Useful if you're making a repository with git packages so that they can have sequential
  # version numbers. (Else a pacman -Syu may not update the package)
}

package() {
  cd "$srcdir/$pkgname"
  make DESTDIR="$pkgdir/" PKGNAME="$pkgname" install
  
  # cleanup of git specific files
  rm -rf $(find "$pkgdir" -type d -name ".git")
}

# vim:set ts=2 sw=2 et:
