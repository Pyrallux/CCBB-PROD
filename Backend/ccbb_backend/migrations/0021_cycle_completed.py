# Generated by Django 5.0.3 on 2024-05-21 17:30

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("ccbb_backend", "0020_physicallymissingpart_location_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="cycle",
            name="completed",
            field=models.BooleanField(default=False),
        ),
    ]
