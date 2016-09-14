CREATE TABLE [dbo].[BlogImage] (
    [Id]       INT            IDENTITY (1, 1) NOT NULL,
    [FilePath] NVARCHAR (100) NOT NULL,
    [BlogId]   INT            NOT NULL,
    CONSTRAINT [PK_BlogImage] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_BlogImage_Blog] FOREIGN KEY ([BlogId]) REFERENCES [dbo].[Blog] ([Id])
);

