#!/bin/bash
export PGPASSWORD="camaleao"
pg_dump -U postgres -h localhost -d treepy -F c -f ../bkup/backup.dump