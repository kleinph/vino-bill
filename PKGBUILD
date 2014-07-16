# Maintainer: Philipp Klein <philipptheklein@gmail.com>

pkgname=vino-bill
pkgver=1.2
pkgrel=2
pkgdesc="A web based invoice management tool for winemakers"
arch=('any')
url="https://github.com/kleinph/vino-bill"
license=('GPL')
depends=('python2-django')
makedepends=('git')
optdepends=('cups: printing support')
backup=(var/lib/"$pkgname"/database.db)
options=()
install=vino-bill.install
source=(git://github.com/kleinph/vino-bill.git#branch=release)
md5sums=('SKIP')

# only usable with pacman >= 4.1
pkgver() {
  cd "$srcdir/$pkgname"
  echo $(git describe --always | sed 's/-/./g')
}

package() {
  cd "$srcdir/$pkgname"
  make DESTDIR="$pkgdir/" PKGNAME="$pkgname" install
}

# vim:set ts=2 sw=2 et:
