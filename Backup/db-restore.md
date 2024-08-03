# How to Restore a database

- Stop the container(s) that are using the volume. If volume was initially created using docker-compose, find out exact volume name using:

`docker volume ls`

- Remove existing volume (the example assumes it’s named data):

`docker volume rm data`

- Create new volume with the same name and restore a snapshot:

`docker run --rm -it -v data:/backup/my-app-backup -v /path/to/local_backups:/archive:ro alpine tar -xvzf /archive/full_backup_filename.tar.gz`

- Restart the container(s) that are using the volume.

Alternatively, the desired `.tar.gz` file found in `/Backup/archive` can be decompressed, and the docker container can be rebuild manually using the old decompressed `db.sqlite3` file as its db-data.
