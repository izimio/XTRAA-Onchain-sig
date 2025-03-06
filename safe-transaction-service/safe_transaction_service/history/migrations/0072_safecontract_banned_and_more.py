# Generated by Django 4.1.7 on 2023-04-05 15:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("history", "0071_alter_ethereumblock_confirmed_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="safecontract",
            name="banned",
            field=models.BooleanField(default=False),
        ),
        migrations.AddIndex(
            model_name="safecontract",
            index=models.Index(
                condition=models.Q(("banned", True)),
                fields=["banned"],
                name="history_safe_banned_idx",
            ),
        ),
    ]
