DESTDIR=/
PKGNAME=vino-bill

install:
	mkdir -p $(DESTDIR)usr/share/$(PKGNAME)
	mkdir -p $(DESTDIR)var/lib/$(PKGNAME)/invoices/
	cp -r server/ $(DESTDIR)usr/share/$(PKGNAME)
	mv $(DESTDIR)usr/share/$(PKGNAME)/server/database.db $(DESTDIR)var/lib/$(PKGNAME)/
	mkdir -p $(DESTDIR)usr/lib/systemd/system/
	cp $(PKGNAME).service $(DESTDIR)usr/lib/systemd/system/

uninstall:
	rm -rf $(DESTDIR)usr/share/$(PKGNAME)
	rm -f $(DESTDIR)usr/lib/systemd/system/$(PKGNAME).service
