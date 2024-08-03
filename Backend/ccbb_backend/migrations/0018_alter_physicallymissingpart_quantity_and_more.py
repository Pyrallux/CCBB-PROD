# Generated by Django 5.0.1 on 2024-03-16 21:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ccbb_backend', '0017_remove_physicallymissingpart_location_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='physicallymissingpart',
            name='quantity',
            field=models.FloatField(max_length=100),
        ),
        migrations.AlterField(
            model_name='presentpart',
            name='quantity',
            field=models.FloatField(max_length=100),
        ),
        migrations.AlterField(
            model_name='systematicallymissingpart',
            name='quantity',
            field=models.FloatField(max_length=100),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='quantity',
            field=models.FloatField(max_length=100),
        ),
    ]
