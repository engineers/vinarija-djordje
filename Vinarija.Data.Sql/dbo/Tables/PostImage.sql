CREATE TABLE [dbo].[PostImage] (
    [Id]       INT            IDENTITY (1, 1) NOT NULL,
    [FilePath] NVARCHAR (100) NOT NULL,
    [PostId]   INT            NOT NULL,
    CONSTRAINT [PK_BlogImage] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_BlogImage_Blog] FOREIGN KEY ([PostId]) REFERENCES [dbo].[Post] ([Id])
);

